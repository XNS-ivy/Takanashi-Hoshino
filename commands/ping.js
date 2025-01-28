import { textMessage } from '../models/waSockets/messageModel.js'
import { shiroko } from '../modules/waSockets/waSocket.js'

export default {
    name: 'ping',
    type: 'main',
    execute: async (msg, args, client) => {
        const response = args.length > 0 ? `Pong! ${args.join(' ')}` : 'Pong!'
        const option = textMessage(response, client, msg.expired)
        await shiroko.sendMessage(msg.remoteJid, option.text, option.options)
    },
}