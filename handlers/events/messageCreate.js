import { handleMessage } from '../helpHandle.js'

export default async function onMessageCreate(message, commands) {
    // console.log(message.author) // <--- Display the user who sent the message
    // console.log(message.content) // <--- Display the message content
    // console.log(message.channel) // <--- Display the channel where the message was sent
    // console.log(message.guild) // <--- Display the server where the message was sent
    // console.log(message.member) // <--- Display the member who sent the message
    // console.log(message.attachments) // <--- Display the attachments of the message
    // console.log(message.mentions) // <--- Display the mentioned users in the message
    // console.log(message.mentions.users) // <--- Display the mentioned users in the message
    // console.log(message.mentions.roles) // <--- Display the mentioned roles in the message
    // console.log(message.mentions.every()) // <--- Display every mention in the message
    // console.log(message.mentions.roles.cache) // <--- Display every mention in the message
    // console.log(message.mentions.roles.cache.size) // <--- Display every mention in the messag
    // console.log(message.mentions.roles.cache.size) // <--- Display every mention in the messag
    // console.log(message.mentions.roles.cache.size) // <--- Display every mention in the mess

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