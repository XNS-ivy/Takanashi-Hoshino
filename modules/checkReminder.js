import Reminder from './reminderModel.js'
import moment from 'moment'

/**
 * Check for reminders that are due and send messages
 * @param {Object} shiroko - WhatsApp socket instance
 */
export async function checkDueReminders(shiroko) {
    try {
        const currentTime = moment().format('YYYY-MM-DD HH:mm:ss')

        const dueReminders = await Reminder.find({
            reminderDate: { $lte: currentTime },
            status: 'pending',
        })
        for (const reminder of dueReminders) {
            const options = reminder.ephemeralExpiration
                ? { ephemeralExpiration: reminder.ephemeralExpiration }
                : {}
            await shiroko.sendMessage(
                reminder.user,
                { text: `Task Reminder: "${reminder.task}" is due now! \n\n@${reminder.phoneNumber.split('@')[0]}`, mentions: [reminder.phoneNumber] },
                options
            )

            reminder.status = 'completed'
            await reminder.save()
        }

        const deleteResult = await Reminder.deleteMany({ status: 'completed' })
    } catch (error) {
        console.error('Error checking due reminders:', error)
    }
}