import { loadSubCommand } from "../../modules/subCommandLoader.js"
import { sendTextMessage } from "../../modules/waSockets/messsageSender.js"

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

        await sendTextMessage(msg.remoteJid, response, client, msg.expired)
    }
}