import { Client, GatewayIntentBits, Collection, Events } from 'discord.js'
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { connectDatabase } from './modules/mongo.js'

// __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Bot Installation
const hoshino = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
})
hoshino.commands = new Collection()

// Dynamic Commands
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const command = (await import(pathToFileURL(path.join(__dirname, 'commands', file)))).default
    hoshino.commands.set(command.name, command)
}

// Event: Bot ready
hoshino.once(Events.ClientReady, () => {
    console.log('Hoshino Ready!')
});

// Event: Message
hoshino.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return

    const lowerContent = message.content.toLowerCase()
    if (lowerContent === 'help') {
        const helpCommand = hoshino.commands.get('menu')
        if (helpCommand) await helpCommand.execute(message)
        return
    }
    if (lowerContent === 'prefix') {
        await message.reply(`Prefix now is : \`${process.env.prefix}\` Sensei..`)
        return
    }

    if (!message.content.startsWith(process.env.prefix)) return

    const args = message.content.slice(process.env.prefix.length).trim().split(/ +/)
    const commandName = args.shift().toLowerCase()
    const command = hoshino.commands.get(commandName)

    if (!command) return

    try {
        await command.execute(message, args)
    } catch (error) {
        console.error(error)
        message.reply('Gomenne Sensei looks like there was an error executing that command!')
    }
})


// Login bot
connectDatabase().then(async () => {
    await hoshino.login(process.env.token).catch(console.error)
}).catch(console.error)