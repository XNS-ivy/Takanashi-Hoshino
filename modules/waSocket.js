import { makeWASocket, useMultiFileAuthState } from '@whiskeysockets/baileys'
import pino from 'pino'
import { connectionHandle } from '../handlers/socketConnection.js'
import { handlingMessage } from '../handlers/events/mesageHandler.js'

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState("auth")
    const shiroko = makeWASocket({
        printQRInTerminal: true,
        auth: state,
        logger: pino({ level: 'silent' }),
        browser: ['Shiroko', 'Chrome', '1.0'],
        emitOwnEvents: false,
    })

    try {
    shiroko.ev.on('connection.update', async (update) => {
        await connectionHandle(update)
    })

    shiroko.ev.on('creds.update', async () => {
        await saveCreds()
    })
    shiroko.ev.on('messages.upsert', async (message) =>{
        const msg = await handlingMessage(message)
    })
    } catch (error) {
        console.error('Error : ', error)
        process.exit(1)
    }
}

export { start }