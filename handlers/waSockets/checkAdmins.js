import { shiroko } from "../../modules/waSockets/waSocket.js"

export async function checkAdmins(id) {
    const metadata = await shiroko.groupMetadata(id.remoteJid)
    const isAdmin = metadata.participants.some(
        (participant) => participant.id === id.phoneNumber && participant.admin
    )
    return isAdmin
}