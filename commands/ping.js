export default {
    name: 'ping',
    type: 'text',
    execute: async (shiroko, msg, args, client) => {
        const response = args.length > 0 ? `Pong! ${args.join(' ')}` : 'Pong!'
        await shiroko.sendMessage(msg.remoteJid, { text: response }, { quoted: client, ephemeralExpiration: msg.expired})
    },
}