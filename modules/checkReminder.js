import Reminder from './remindModel.js';

/**
 * Check for reminders that are due and send messages
 * @param {Object} shiroko - WhatsApp socket instance
 */
export async function checkDueReminders(shiroko) {
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');

    try {
        const dueReminders = await Reminder.find({
            reminderDate: { $lte: currentTime },
            status: 'pending',
        });

        for (const reminder of dueReminders) {
            const options = {};
            if (reminder.ephemeralExpiration > 0) {
                options.ephemeralExpiration = reminder.ephemeralExpiration;
            }
            const text = `Reminder: "${reminder.task}" is due now!`;
            await shiroko.sendMessage(reminder.user, { text }, options);
            reminder.status = 'completed';
            await reminder.save();
        }
    } catch (error) {
        console.error('Error checking due reminders:', error);
    }
}