import { checkReminder, deleteReminders } from "../mongodb/reminders/checkReminder.js"

export async function sendReminder(shiroko) {
    const tasks = await checkReminder()

    if (!tasks || tasks.length === 0) {
        return
    }

    tasks.forEach(async (task) => {
        const { user, phoneNumber, task: taskName, reminderDate, messageExpired } = task

        const response = `Task Reminder: ${taskName} Is Due Now!\n\n @${phoneNumber.split('@')[0]} - ${reminderDate}`
        shiroko.sendMessage(user, { text: response, mentions: [phoneNumber] }, { ephemeralExpiration: messageExpired })
        await deleteReminders()
    })
}