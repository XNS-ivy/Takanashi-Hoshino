import { makeWASocket, useMultiFileAuthState } from '@whiskeysockets/baileys'
import pino from 'pino'
import { connectionHandle } from './socketConnection.js'
import { handlingMessage } from '../../handlers/waSockets/messageHandler.js'
import { loadCommands } from '../commandLoader.js'
import fs from 'fs'
import { sendReminder } from '../reminders/reminder.js'
import schedule from 'node-schedule'
import { generateCAIText } from '../axios/caiRequest.js'

let hoshino = {}

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState('auth')
    hoshino = makeWASocket({
        printQRInTerminal: true,
        auth: state,
        logger: pino({ level: 'silent' }),
        browser: ['hoshino', 'Chrome', '1.0'],
        emitOwnEvents: false,
        generateHighQualityLinkPreview: true,
    })

    const config = JSON.parse(fs.readFileSync('./hoshinoConfig.json', 'utf-8'))
    const prefix = config.prefix

    const commands = await loadCommands('./commands')

    try {
        hoshino.ev.on('connection.update', async (update) => {
            await connectionHandle(update)
        });

        hoshino.ev.on('creds.update', async () => {
            await saveCreds()
        });

        hoshino.ev.on('messages.upsert', async (message) => {
            const msg = await handlingMessage(message)
            const godMode = config.godMode === true ? true : false
            if (msg?.text) {
                if (!msg.text.startsWith(prefix)) {
                    if (godMode && !msg.text.startsWith(prefix) && msg.mentionOrChatWithMe) {
                        const caiText = await generateCAIText(msg.phoneNumber, msg.text)
                        await hoshino.sendMessage(msg.remoteJid, { text: caiText }, { quoted: message.messages[0], ephemeralExpiration: msg.expired })
                    }
                    return
                }

                const [commandName, ...args] = msg.text.slice(prefix.length).trim().split(/\s+/)
                const command = commands.get(commandName)
                if (command) {
                    await command.execute(msg, args, message.messages[0])
                } else {
                    await hoshino.sendMessage(msg.remoteJid, { text: "Command Not Found!" }, { quoted: message.messages[0], ephemeralExpiration: msg.expired })
                }
            }
        })
        schedule.scheduleJob('*/5 * * * * *', async () => {
            await sendReminder(hoshino)
        })
    } catch (error) {
        console.error('Error:', error)
        process.exit(1)
    }
}

export { start, hoshino }