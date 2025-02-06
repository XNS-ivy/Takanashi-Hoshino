import axios from "axios"
import { configDotenv } from "dotenv"
import { sendTextMessage } from "../../modules/waSockets/messsageSender.js"

export default {
    name: 'gpt',
    type: "ai",
    usage: "`gpt` `text`",
    execute: async (msg, args, client) => {
        let response
        const request = args.join(" ")

        if (request.length <= 0) {
            response = `no argument`
        } else {
            try {
                const apiResponse = await axios.post(process.env.gpt_api, {
                    model: 'gpt-4o-mini',
                    messages: [
                        {
                            role: "developer",
                            content: request,
                        },
                        {
                            role: 'user',
                            content: request
                        }
                    ]
                })
                response = apiResponse.data.result.choices[0].message.content
            } catch (error) {
                response = `Error: ${error.message}`
            }
        }
        await sendTextMessage(msg.remoteJid, response, client, msg.expired)
    }
}