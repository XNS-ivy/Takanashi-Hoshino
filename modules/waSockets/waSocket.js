import { makeWASocket, useMultiFileAuthState } from '@whiskeysockets/baileys'
import pino from 'pino'
import { connectionHandle } from './socketConnection.js'
import { handlingMessage } from '../../handlers/waSockets/messageHandler.js'
import { loadCommands } from '../commandLoader.js'
import fs from 'fs'
import { sendReminder } from '../reminders/reminder.js'
import schedule from 'node-schedule'
import { generateCAIText } from '../axios/caiRequest.js'

let shiroko = {}

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
            const godMode = config.godMode === true ?? false
            if (msg?.text) {
                if (!msg.text.startsWith(prefix)) {
                    if (godMode && !msg.text.startsWith(prefix) && msg.mentionOrChatWithMe) {
                        const caiText = await generateCAIText(msg.phoneNumber, msg.text)
                        await shiroko.sendMessage(msg.remoteJid, { text: caiText }, { quoted: message.messages[0], ephemeralExpiration: msg.expired })
                    }
                    return
                }

                const [commandName, ...args] = msg.text.slice(prefix.length).trim().split(/\s+/)
                const command = commands.get(commandName)
                console.log(godMode)
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