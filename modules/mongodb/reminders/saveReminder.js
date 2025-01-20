import Reminder from '../../../models/reminders/reminderModel.js'

export async function saveReminderToMongo(id, { task, time }, messageExpiration) {
    try {
        const userReminder = await Reminder.findOne({ user: id })

        if (userReminder) {
            userReminder.reminders.push({
                task,
                reminderDate: time,
                ephemeralExpiration: messageExpiration,
            })

            await userReminder.save()
        } else {
            const newReminder = new Reminder({
                user: id,
                reminders: [
                    {
                        task,
                        reminderDate: time,
                        ephemeralExpiration: messageExpiration,
                    },
                ],
            })

            await newReminder.save()
        }

        return `Task Reminder '${task}' Saved Successfully \nWill Be Sent At ${time}`
    } catch (error) {
        console.error(error)
        return 'Error While Saving Reminder to Mongo: ' + error.message
    }
}