import { generateCAIText } from "../../modules/axios/caiRequest.js"
import { sendTextMessage } from "../../modules/waSockets/messsageSender.js"

export default {
    name: "cai",
    type: "ai",
    usage: "`cai` `text`",
    execute: async (msg, args, client) => {
        const text = await generateCAIText(msg.phoneNumber, args.join(' '))
        setTimeout(async () => {
            await sendTextMessage(msg.remoteJid, text, client, msg.expired)
        }, 1000)
    }
}