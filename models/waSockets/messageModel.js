
function imageMessage(url, client, expired, caption) {
    const content = {
        image: { image: url, caption: caption },
        options: { quoted: client, ephemeralExpiration: expired }
    }
    return content
}

function textMessage(response, client, expired, mention) {
    const content = {
        text: { text: response ,
            mentions: mention ?? null,
        },
        options: { quoted: client, ephemeralExpiration: expired }
    }
    return content
}

export {
    imageMessage,
    textMessage,
}