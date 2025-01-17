import fs from 'fs/promises'
import { start } from './waSocket.js'

/**
 * Handling Connection Update
 * @param {*} update - the connection state  
 */
export async function connectionHandle(update) {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
        console.log('Disconnected!')
        if (lastDisconnect?.error?.output?.statusCode === 401) {
            console.log('Auth Not Valid Anymore, Restart Scanning')
            fs.rm('./auth', { recursive: true, force: true })
        }
        try {
            setTimeout(async () => {
                await start()
            }, 3000)
        } catch (err) {
            console.error('Failed To Restart Bot:', err)
        }
    } else if (connection === 'open') {
        console.log('Connected!')
    }
}