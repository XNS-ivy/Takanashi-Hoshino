import { checkReminder, deleteReminders } from "../mongodb/reminders/checkReminder.js"

export async function sendReminder(shiroko) {
    const tasks = await checkReminder()

    if (!tasks || tasks.length === 0) {
        return
    }

    tasks.forEach(async (task) => {
        const { user, task: taskName, reminderDate, messageExpired } = task

        const response = `Task Reminder: ${taskName} Is Due Now!\n\n @${user.split('@')[0]} - ${reminderDate}`
        shiroko.sendMessage(user, { text: response, mentions: [user] }, { ephemeralExpiration: messageExpired })
        await deleteReminders()
    })
}