import pkg from 'discord.js'
const { Client, GatewayIntentBits } = pkg
import 'dotenv/config'

const hoshino = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
})

hoshino.once('ready', async () => {
    console.log('Hoshino is ready')
})
hoshino.login(process.env.token).catch((err) => { console.log(err) })
