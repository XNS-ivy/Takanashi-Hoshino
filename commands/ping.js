import { sendTextMessage } from '../modules/waSockets/messsageSender.js'

export default {
    name: 'ping',
    type: 'main',
    execute: async (msg, args, client) => {
        const response = args.length > 0 ? `Pong! ${args.join(' ')}` : 'Pong!'
        await sendTextMessage(msg.remoteJid, response, client, msg.expired)
    },
}