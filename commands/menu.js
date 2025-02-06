import { loadCommands } from "../modules/commandLoader.js"
import { sendTextMessage } from "../modules/waSockets/messsageSender.js"

export default {
    name: "menu",
    type: "menu",
    usage: "`menu`",
    execute: async (msg, args, client) => {
        const commands = await loadCommands()
        
        const categorizedCommands = {}
        commands.forEach((cmd) => {
            if (!categorizedCommands[cmd.type]) {
                categorizedCommands[cmd.type] = []
            }
            categorizedCommands[cmd.type].push(cmd)
        })
        const sortedTypes = Object.keys(categorizedCommands).sort()
        
        let menuText = "*Command List:*"
        sortedTypes.forEach((type) => {
            menuText += `\n*${type.toUpperCase()}*\n`
            categorizedCommands[type]
                .sort((a, b) => a.name.localeCompare(b.name))
                .forEach((cmd) => {
                    menuText += `- *${cmd.name}* ${cmd.usage ? cmd.usage : "(no usage info)"}\n`
                })
        })

        await sendTextMessage(msg.remoteJid, menuText.trim(), client, msg.expired)
    },
}
