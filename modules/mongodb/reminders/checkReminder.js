import Reminder from '../../../models/reminders/reminderModel.js'
import moment from 'moment'

export async function checkReminder() {
    try {
        const pendingReminders = await Reminder.find({ 'reminders.status': 'pending' })

        const now = moment()
        const results = []

        for (const reminder of pendingReminders) {
            for (const item of reminder.reminders) {
                if (item.status === 'pending' && moment(item.reminderDate).isSameOrBefore(now)) {
                    results.push({
                        user: reminder.user,
                        phoneNumber: reminder.phoneNumber,
                        task: item.task,
                        reminderDate: item.reminderDate,
                        messageExpired: item.ephemeralExpiration,
                    })

                    item.status = 'completed'
                }
            }

            await reminder.save()
        }
        return results
    } catch (error) {
        console.error('Error checking reminders:', error)
        throw new Error('Error checking reminders: ' + error.message)
    }
}

export async function listReminder(id) {
    try {
        const reminders = await Reminder.findOne({ 'user': id }, { 'reminders.task': 1, 'reminders.reminderDate': 1 })

        if (!reminders?.reminders?.length) {
            return "No reminders found for this user."
        }

        const taskList = reminders.reminders.map((item, index) => {
            return `${index + 1}. Task: "${item.task}", Reminder Date: ${item.reminderDate}`
        })

        return taskList.join('\n')
    } catch (error) {
        console.error('Error listing reminders:', error)
        throw new Error('Error listing reminders: ' + error.message)
    }
}

export async function deleteReminders(id = null, task = null) {
    try {
        if (!id && !task) {
            await Reminder.updateMany(
                {},
                { $pull: { reminders: { status: 'completed' } } }
            )
            return "All completed reminders have been deleted."
        }

        if (id && task) {
            const reminder = await Reminder.findOne({ 'user': id })

            if (!reminder?.reminders?.length) {
                return `No reminders found for this user.`
            }

            const result = await Reminder.updateOne(
                { _id: reminder._id },
                { $pull: { reminders: { task: task } } }
            )

            return result.modifiedCount > 0
                ? `Task Reminder: "${task}" Was Deleted`
                : `Task Reminder: "${task}" Not Found!`
        }

        return false
    } catch (error) {
        console.error('Error deleting reminders:', error)
        throw new Error('Error deleting reminders: ' + error.message)
    }
}