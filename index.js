import { Client, GatewayIntentBits, Collection, Events } from 'discord.js';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

// __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Bot Installation
const hoshino = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});
hoshino.commands = new Collection();

// Dynamic Commands
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = (await import(pathToFileURL(path.join(__dirname, 'commands', file)))).default;
    hoshino.commands.set(command.name, command);
    console.log(command)
}

// Event: Bot ready
hoshino.once(Events.ClientReady, () => {
    console.log('Hoshino Ready!');
});

// Event: pesan
hoshino.on(Events.MessageCreate, async (message) => {
    if (message.author.bot || !message.content.startsWith(process.env.prefix)) return;

    const args = message.content.slice(process.env.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = hoshino.commands.get(commandName);

    if (!command) return;
    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply(`Error while execute Commands! :\n${error}`);
    }
});

// Login bot
hoshino.login(process.env.token).catch(console.error);
