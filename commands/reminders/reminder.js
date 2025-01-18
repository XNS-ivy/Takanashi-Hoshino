import { handlingReminder } from '../../handlers/reminders/reminder.js'
export default {
    name: "remind",
    type: "main",
    execute: async (shiroko, msg, args, client) => {
        const taskAndTime = await handlingReminder(args)
    }
}