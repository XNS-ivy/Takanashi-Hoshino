import mongoose from 'mongoose'

const reminderSchema = new mongoose.Schema({
    user: { type: String, required: true },
    task: { type: String, required: true },
    reminderDate: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, default: 'pending' },
    ephemeralExpiration: { type: Number, default: 0 },
});

const Reminder = mongoose.model('Reminder', reminderSchema)

export default Reminder