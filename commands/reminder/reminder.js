import { textMessage } from '../../modules/messageOptions.js'
import { handlingReminder } from '../../handlers/reminderHandling.js'
import { saveReminder } from '../../modules/remindMongo.js'

export default {
    name: "remind",
    type: "text",
    execute: async (shiroko, msg, args, client) => {
        try {
            const remind = await handlingReminder(args)

            let response;
            if (remind?.task && remind?.date) {
                const ephemeralSeconds = msg.expired || 0
                
                const reminderId = await saveReminder({
                    user: msg.remoteJid,
                    phoneNumber: msg.phoneNumber,
                    task: remind.task,
                    reminderDate: remind.date,
                    ephemeralExpiration: ephemeralSeconds,
                })
                response = `Task Reminder : "${remind.task}" saved! You will be reminded on ${remind.date}.`
            } else {
                response = remind
            }

            const option = textMessage(response, client, msg.expired)
            await shiroko.sendMessage(msg.remoteJid, option.text, option.options)
        } catch (error) {
            console.error('Error in remind command:', error)
            const option = textMessage('An error occurred while saving the reminder.', client, msg.expired)
            await shiroko.sendMessage(msg.remoteJid, option.text, option.options)
        }
    },
}