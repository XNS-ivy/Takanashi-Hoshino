import { hoshino } from "../../modules/waSockets/waSocket.js"
import { checkAdmins } from "../../handlers/waSockets/checkAdmins.js"
import { sendTextMessage } from "../../modules/waSockets/messsageSender.js"

export default {
    name: "kick",
    type: "moderation",
    execute: async (msg, args, client) => {
        const isAdmin = await checkAdmins(msg)
        let response
        if (isAdmin) {
            const modifiedArgs = args.map(arg => {
                const cleanNumber = arg.startsWith('@') ? arg.slice(1) : arg
                return cleanNumber.endsWith('@s.whatsapp.net') ? cleanNumber : `${cleanNumber}@s.whatsapp.net`
            })
            response = `:Bot Moderation:\n\nKicking: ${args}`
            await sendTextMessage(msg.remoteJid, response, client, msg.expired, modifiedArgs)
            try {
                await hoshino.groupParticipantsUpdate(msg.remoteJid, modifiedArgs, 'remove')
            } catch (error) {
                response = `:Bot Moderation:\n\n Bot Not A Admin, Please Promote This Bot Become Admin.`
                await sendTextMessage(msg.remoteJid, response, client, msg.expired)
            }
        } else {
            response = ":Bot Moderation:\n\nYou do not have permission to use this command."
            await sendTextMessage(msg.remoteJid, response, client, msg.expired)
        }
    },
}