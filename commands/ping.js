import { textMessage } from '../models/waSockets/messageModel.js'

export default {
    name: 'ping',
    type: 'main',
    execute: async (shiroko, msg, args, client) => {
        const response = args.length > 0 ? `Pong! ${args.join(' ')}` : 'Pong!'
        const option = textMessage(response, client, msg.expired)
        await shiroko.sendMessage(msg.remoteJid, option.text, option.options)
    },
}