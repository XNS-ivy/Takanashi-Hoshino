import { textMessage} from '../../modules/messageOptions.js'

export default {
    name: "remind",
    type: "text",
    execute: async (shiroko, msg, args, client) => {
        const response = args.length > 0 ? `Reminder "${args}" Saved!` : 'Reminder Saved!'
        const option = textMessage(response, client, msg.expired)
        await shiroko.sendMessage(msg.remoteJid, option.text, option.options)
    }
}