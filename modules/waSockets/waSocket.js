import { makeWASocket, useMultiFileAuthState } from '@whiskeysockets/baileys'
import pino from 'pino'
import { connectionHandle } from './socketConnection.js'
import { handlingMessage } from '../../handlers/waSockets/messageHandler.js'
import { loadCommands } from '../commandLoader.js'
import fs from 'fs'
import { sendReminder } from '../reminders/reminder.js'
import schedule from 'node-schedule'

/**
 * @type {makeWASocket | null} WhatsApp socket instance, initialized after start().
 */
let shiroko = null;

/**
 * Starts the WhatsApp socket connection and sets up handlers.
 * @returns {Promise<void>} Initializes the WhatsApp bot.
 */
async function start() {
    const { state, saveCreds } = await useMultiFileAuthState('auth')
    shiroko = makeWASocket({
        printQRInTerminal: true,
        auth: state,
        logger: pino({ level: 'silent' }),
        browser: ['Shiroko', 'Chrome', '1.0'],
        emitOwnEvents: false,
        generateHighQualityLinkPreview: true,
    })

    const config = JSON.parse(fs.readFileSync('./shirokoConfig.json', 'utf-8'))
    const prefix = config.prefix

    const commands = await loadCommands('./commands')

    try {
        shiroko.ev.on('connection.update', async (update) => {
            await connectionHandle(update)
        });

        shiroko.ev.on('creds.update', async () => {
            await saveCreds()
        });

        shiroko.ev.on('messages.upsert', async (message) => {
            const msg = await handlingMessage(message)
            if (msg?.text) {
                if (!msg.text.startsWith(prefix)) {
                    return
                }

                const [commandName, ...args] = msg.text.slice(prefix.length).trim().split(/\s+/)
                const command = commands.get(commandName)

                if (command) {
                    await command.execute(msg, args, message.messages[0])
                } else {
                    await shiroko.sendMessage(msg.remoteJid, { text: "Command Not Found!" }, { quoted: message.messages[0], ephemeralExpiration: msg.expired })
                }
            }
        })
        schedule.scheduleJob('*/5 * * * * *', async () => {
            await sendReminder(shiroko)
        })
    } catch (error) {
        console.error('Error:', error)
        process.exit(1)
    }
}

export { start, shiroko }