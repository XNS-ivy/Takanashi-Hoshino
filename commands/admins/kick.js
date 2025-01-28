import { shiroko } from "../../modules/waSockets/waSocket.js"
import { checkAdmins } from "../../handlers/waSockets/checkAdmins.js"
import { textMessage } from '../../models/waSockets/messageModel.js'

export default {
    name: "kick",
    type: "admin moderation",
    execute: async (msg, args, client) => {
        const isAdmin = await checkAdmins(msg)
        let response
        if (isAdmin) {
            const modifiedArgs = args.map(arg => {
                const cleanNumber = arg.startsWith('@') ? arg.slice(1) : arg
                return cleanNumber.endsWith('@s.whatsapp.net') ? cleanNumber : `${cleanNumber}@s.whatsapp.net`
            })
            response = `:Bot Moderation:\n\nKicking: ${args}`
            let option = textMessage(response, client, msg.expired, modifiedArgs)
            await shiroko.sendMessage(msg.remoteJid, option.text, option.options)
            try {
                await shiroko.groupParticipantsUpdate(msg.remoteJid, modifiedArgs, 'remove')
            } catch (error) {
                response = `:Bot Moderation:\n\n Bot Not A Admin, Please Promote This Bot Become Admin.`
                option = textMessage(response, client, msg.expired)
                await shiroko.sendMessage(msg.remoteJid, option.text, option.options)
            }
        } else {
            response = ":Bot Moderation:\n\nYou do not have permission to use this command."
            const option = textMessage(response, client, msg.expired)
            await shiroko.sendMessage(msg.remoteJid, option.text, option.options)
        }
    },
}