import axios from "axios"
import { configDotenv } from "dotenv"
import { shiroko } from "../../modules/waSockets/waSocket.js"
import { textMessage } from "../../models/waSockets/messageModel.js"

export default {
    name: 'gpt',
    type: "ai",
    execute: async (msg, args, client) => {
        let response
        const request = args.join(" ")
        
        if(request.length <= 0){
            response = `no argument`
        } else {
            try {
                const apiResponse = await axios.post(process.env.gpt_api, {
                    model: 'gpt-4o-mini',
                    messages: [
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
        const option = textMessage(response, client, msg.expired)
        await shiroko.sendMessage(msg.remoteJid, option.text, option.options)
    }
}