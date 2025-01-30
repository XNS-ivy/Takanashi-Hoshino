import { shiroko } from "./waSocket.js"

async function sendImageMessage(url, client, expired, caption) {
    const content = {
        image: { image: url, caption: caption },
        options: { quoted: client, ephemeralExpiration: expired }
    }
    try {
        
    } catch (error) {
        
    }
}

async function sendTextMessage(id, response, client, expired, mentions) {
    const content = {
        text: {
            text: response,
            mentions: mentions ?? null,
        },
        options: { quoted: client, ephemeralExpiration: expired }
    }
    try {
        await shiroko.sendMessage(id, content.text, content.options)
    } catch (error) {
        await shiroko.sendMessage(id, { text: `Error Sending Mesage: ${error}` }, content.options)
    }
}

export {
    sendImageMessage,
    sendTextMessage,
}