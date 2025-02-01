import { generateCAIText } from "../../modules/axios/caiRequest.js"
import { sendTextMessage } from "../../modules/waSockets/messsageSender.js"

export default {
    name: "cai",
    type: "ai",
    execute: async (msg, args, client) => {
        const text = await generateCAIText(msg.phoneNumber, args.join(' '))
        await sendTextMessage(msg.remoteJid, text, client, msg.expired)
    }
}