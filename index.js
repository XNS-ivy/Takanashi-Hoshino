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

// Validate .env
if (!process.env.token) {
    console.error('Discord bot token is not set in .env file')
    process.exit(1)
}

try {
    // Load Commands
    await loadCommands(hoshino.commands, path.join(__dirname, 'commands'))

    // Event: Bot Ready
    hoshino.once(Events.ClientReady, () => onReady(hoshino))

    // Event: Message Create
    hoshino.on(Events.MessageCreate, (message) => onMessageCreate(message, hoshino.commands))

    // Connect to Database and Login Bot
    await connectDatabase()
    await hoshino.login(process.env.token)
} catch (error) {
    console.error('Error during initialization:', error)
    process.exit(1)
}

// Global Error Handling
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error)
    process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason)
    process.exit(1)
})

process.on('rejectionHandled', (promise) => {
    console.warn('Promise handled after rejection:', promise)
})