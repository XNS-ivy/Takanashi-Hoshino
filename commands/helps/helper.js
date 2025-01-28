import { loadSubCommand } from "../../modules/subCommandLoader.js"
import { textMessage } from "../../models/waSockets/messageModel.js"
import { shiroko } from "../../modules/waSockets/waSocket.js"

export default {
    name: 'help',
    type: 'help',
    execute: async (msg, args, client) => {
        const [commandName] = args
        const subCommands = await loadSubCommand('./commands')

        let response = ''
        if (!commandName) {
            response = `Available Help Commands:\n\n*${[...subCommands.keys()].join(', ')}*`
        } else {
            const subCmd = subCommands.get(commandName)
            if (subCmd) {
                const { description, usage, example } = subCmd.execute(args.slice(1))
                response = `*_Description_* : ${description}\n\n*_Usage_* : ${usage}\n\n*_Example_* : ${example}`
            } else {
                response = `Help command "*${commandName}*" not found!`
            }
        }

        const option = textMessage(response, client, msg.expired)
        await shiroko.sendMessage(msg.remoteJid, option.text, option.options)
    }
}