import { configDotenv } from "dotenv"
import axios from "axios"
import { sendTextMessage } from "../../modules/waSockets/messsageSender.js"

export default {
    name: 'gemini',
    type: 'ai',
    execute: async (msg, args, client) => {
        const prompt = args.join(' ')
        const requestApi = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.gemini_api}`, { contents: [{ parts: [{ text: prompt }] }] })
        const { text } = requestApi?.data?.candidates[0].content.parts[0]
        await sendTextMessage(msg.remoteJid, text, client, msg.expired)
    }
}