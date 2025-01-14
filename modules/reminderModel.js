// reminderModel.js
import { mongoose } from 'mongoose'

// Define the schema for the reminder
const reminderSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    nama: {
        type: String,
        required: true
    },
    nomorHp: {
        type: String,
        required: true
    },
    reminder: {
        type: String,
        required: true
    },
    waktu: {
        type: Date,
        required: true
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create the model from the schema
const Reminder = mongoose.model('Reminder', reminderSchema);

// Export the model
export { Reminder }