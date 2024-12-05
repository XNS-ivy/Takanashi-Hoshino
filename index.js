import pkg, { Events } from 'discord.js'
const { Client, GatewayIntentBits, Collection } = pkg
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

// ------------- ++
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// ------------- ++


// -------
const commandPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'))
// -------


const hoshino = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
})
hoshino.commands = new Collection()

for (const file of commandFiles) {
    const filePath = pathToFileURL(path.resolve(commandPath, file));
    const command = (await import(filePath)).default;
    hoshino.commands.set(command.name, command);
}

hoshino.once(Events.ClientReady, async () => {
    console.log('Hoshino Ready!')
})

hoshino.on(Events.MessageCreate, async message => {

    // console.log(message) // to see meesage structure
    // console.log(message.author) // to see author of message
    // console.log(message.channel) // to see channel of message

    if (message.author.bot || !message.content.startsWith(process.env.prefix)) return
    const args = message.content.slice(process.env.prefix.length).trim().split(/ +/g)
    const commandName = args.shift().toLowerCase()
    const command = hoshino.commands.get(commandName)
    if (!command) return
    try {
        await command.execute(message, args)
    } catch (error) {
        console.error(error)
        message.reply('Error')
    }

})

hoshino.login(process.env.token).catch((err) => {
    console.log(err)
})