import { hoshino } from "../../modules/waSockets/waSocket.js"

export async function checkAdmins(id) {
    const metadata = await hoshino.groupMetadata(id.remoteJid)
    const isAdmin = metadata.participants.some(
        (participant) => participant.id === id.phoneNumber && participant.admin
    )
    return isAdmin
}