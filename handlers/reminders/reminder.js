import Reminder from '../../models/reminders/reminderModel.js'
import moment from 'moment-timezone'

export async function handlingReminder(args) {
    const querymap = {
        delete: args[0] === 'delete',
        add: args[0] === 'add',
        list: args[0] === 'list',
    }

    if (!querymap.add && !querymap.delete && !querymap.list) {
        return `Invalid query. Use 'add', 'delete', or 'list' as the first argument`
    }

    let task, time
    const TIMEZONE = "Asia/Jakarta"
    const now = moment().tz(TIMEZONE)

    if (querymap.add) {
        const input = args.slice(1).join(' ')
        const parts = input.split('-')
        task = parts[0]?.trim()

        const existingReminder = await Reminder.findOne({ 'reminders.task': task })

        if (existingReminder) {
            return `Invalid: Task "${task}" already exists! Please use a different task name.`
        }

        if (parts[1]) {
            const timeInput = parts[1].trim()
            const dateTimeParts = timeInput.split(":")
            
            if (dateTimeParts.length === 1) {
                const specificDate = moment.tz(dateTimeParts[0].trim(), "DD MMMM YYYY", TIMEZONE)
                if (specificDate.isValid()) {
                    specificDate.set({ hour: now.hour(), minute: now.minute() })
                    time = specificDate.format("YYYY-MM-DD HH:mm:ss")
                } else {
                    const timeRegex = /^(\d+)([smhdwMy])$/
                    const match = timeInput.match(timeRegex)

                    if (match) {
                        const value = parseInt(match[1], 10)
                        const unit = match[2]
                        time = now.add(value, unit).format("YYYY-MM-DD HH:mm:ss")
                    } else {
                        return `Invalid date format: ${dateTimeParts[0]}. Use formats like "12 February 2025" or "20s, 1m, etc."`
                    }
                }
            } else {
                const specificDate = moment.tz(dateTimeParts[0].trim(), "DD MMMM YYYY", TIMEZONE)
                if (specificDate.isValid()) {
                    specificDate.set({
                        hour: parseInt(dateTimeParts[1], 10),
                        minute: parseInt(dateTimeParts[2] || "0", 10),
                    })
                    time = specificDate.format("YYYY-MM-DD HH:mm:ss")
                } else {
                    return `Invalid time format: ${timeInput}. Use formats like "12 February 2025:20:19" or "20s, 1m, etc."`
                }
            }
        } else {
            time = now.format("YYYY-MM-DD HH:mm:ss")
        }

        return {
            task: task ?? false,
            time: time ?? false,
            query: querymap,
        }
    } else if (querymap.delete) {
        task = args.slice(1).join(' ')
        return { task: task, query: querymap }
    } else if (querymap.list) {
        return { query: querymap }
    }
}