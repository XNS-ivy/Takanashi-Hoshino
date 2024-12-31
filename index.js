import { Client, GatewayIntentBits, Collection, Events } from 'discord.js'
import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDatabase } from './modules/mongo.js'
import { loadCommands } from './handlers/commandLoader.js'
import onReady from './handlers/events/ready.js'
import onMessageCreate from './handlers/events/messageCreate.js'

// __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Bot Initialization
const hoshino = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
})
hoshino.commands = new Collection()

// Load Commands
await loadCommands(hoshino.commands, path.join(__dirname, 'commands'))

// Event: Bot Ready
hoshino.once(Events.ClientReady, () => onReady(hoshino))

// Event: Message Create
hoshino.on(Events.MessageCreate, (message) => onMessageCreate(message, hoshino.commands))

// Connect to Database and Login Bot
await connectDatabase()
    .then(async () => await hoshino.login(process.env.token))
    .catch(console.error)