import mongoose from "mongoose"

const sessionSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true },
    chat_id: { type: String, required: true }
})

const Session = mongoose.model("cai-session", sessionSchema)

async function createSession(phoneNumber, chatID) {
    try {
        const newSession = new Session({ phoneNumber, chat_id: chatID })
        await newSession.save()
    } catch (error) {
        console.error("Error creating session:", error.message)
    }
}

async function readSession(phoneNumber) {
    try {
        return await Session.findOne({ phoneNumber }).exec()
    } catch (error) {
        return null
    }
}

async function updateSession(phoneNumber, chatID) {
    try {
        const updated = await Session.findOneAndUpdate(
            { phoneNumber },
            { chat_id: chatID },
            { new: true, upsert: true }
        )
        return updated
    } catch (error) {
        console.error("Error updating session:", error.message)
    }
}

async function deleteSession(phoneNumber) {
    try {
        await Session.deleteOne({ phoneNumber })
    } catch (error) {
        console.error("Error deleting session:", error.message)
    }
}

export {
    createSession,
    readSession,
    updateSession,
    deleteSession
}