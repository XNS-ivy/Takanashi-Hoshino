import mongoose from 'mongoose'

const reminderSchema = new mongoose.Schema({
    user: { type: String, required: true, unique: true },
    reminders: [
        {
            task: { type: String, required: true },
            reminderDate: { type: Date, required: true },
            status: { type: String, default: 'pending' },
            ephemeralExpiration: { type: Number, default: 0 },
            createdAt: { type: Date, default: Date.now },
        },
    ],
});

const Reminder = mongoose.model('Reminder', reminderSchema);
export default Reminder
