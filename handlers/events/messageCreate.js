import { handleMessage } from '../helpHandle.js'

export default async function onMessageCreate(message, commands) {
    if (message.author.bot) return

    const handled = await handleMessage(message, commands)
    if (handled) return

    if (!message.content.startsWith(process.env.prefix)) return

    const args = message.content.slice(process.env.prefix.length).trim().split(/ +/)
    const commandName = args.shift().toLowerCase()
    const command = commands.get(commandName)
    if (!command) return

    try {
        await command.execute(message, args)
    } catch (error) {
        console.error(error)
        message.reply('Gomenne Sensei looks like there was an error executing that command!');
    }
}