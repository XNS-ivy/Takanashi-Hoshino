import axios from "axios"
import dotenv from "dotenv"
import { readSession, createSession, updateSession, deleteSession } from "../mongodb/cai/cai.js"

dotenv.config()

export async function generateCAIText(phoneNumber, message) {
    try {
      if (message.toLowerCase() === 'delete session' || message.toLowerCase() === "delete chat") {
        await deleteSession(phoneNumber)
        return 'Resetting Chat Session'
      }
        let session = await readSession(phoneNumber)
        let chatID = session?.chat_id || ""

        const response = await axios.post(process.env.apigratis_cai, {
            external_id: process.env.cai_api,
            message: message,
            chat_id: chatID,
            n_ressurect: false,
        })

        if (!session && response.data?.result?.chat_id) {
            await createSession(phoneNumber, response.data.result.chat_id)
        } 
        else if (session && !chatID && response.data?.result?.chat_id) {
            await updateSession(phoneNumber, response.data.result.chat_id)
        }

        return response.data.result.replies[0].text
    } catch (error) {
        console.error("Error sending message:", error.response?.data || error.message)
    }
}