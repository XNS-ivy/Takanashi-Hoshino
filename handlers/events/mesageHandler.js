export async function handlingMessage(msg) {
    if (!msg?.messages[0] || msg?.messages[0]?.key?.remoteJid === 'status@broadcast' || !msg?.messages[0]?.pushName) {
        return;
    }
    const custom = customMessage(msg)
    return custom
}

function customMessage(msg) {
    const messageObj = msg?.messages[0]
    const name = messageObj?.pushName
    const { remoteJid, id, participant } = messageObj?.key || {}
    const participantName = participant ?? remoteJid

    const objectMessageType =
        Object.keys(messageObj?.message || {})[0] == 'senderKeyDistributionMessage' ?
            Object.keys(messageObj?.message || {})[2] : Object.keys(messageObj?.message || {})[0]
    const text =
        objectMessageType === 'extendedTextMessage'
            ? messageObj?.message?.extendedTextMessage?.text
            : objectMessageType === 'conversation'
                ? messageObj?.message?.conversation
                : ['imageMessage', 'videoMessage'].includes(objectMessageType)
                    ? messageObj?.message?.[objectMessageType]?.caption
                    : undefined
    const expiration =
        (objectMessageType === 'extendedTextMessage' &&
            messageObj?.message?.extendedTextMessage?.contextInfo?.expiration) ||
        (['imageMessage', 'videoMessage', 'stickerMessage', 'documentMessage'].includes(objectMessageType) &&
            messageObj?.message?.[objectMessageType]?.contextInfo?.expiration) || 0

    return {
        name: name ?? undefined,
        remoteJid: remoteJid ?? undefined,
        phoneNumber: participantName ?? undefined,
        id: id ?? undefined,
        text: text ?? undefined,
        object: objectMessageType ?? undefined,
        expired: expiration,
    }
}
