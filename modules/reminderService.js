// reminderService.js
import { Reminder } from "./reminderModel.js"

/**
 * Save a new reminder to the database
 * @param {Object} data - The reminder data
 * @param {string} data.id - Unique ID for the reminder
 * @param {string} data.nama - Name of the person
 * @param {string} data.nomorHp - Phone number of the person
 * @param {string} data.reminder - The reminder text
 * @param {Date} data.waktu - The time for the reminder
 * @returns {Promise<Object>} - The saved reminder
 */
async function saveReminder(data) {
    try {
        const reminder = new Reminder({
            id: data.id,
            nama: data.nama,
            nomorHp: data.nomorHp,
            reminder: data.reminder,
            waktu: data.waktu
        });
        return await reminder.save();
    } catch (err) {
        throw new Error(`Error saving reminder: ${err.message}`);
    }
}

/**
 * Fetch reminders from the database
 * @param {Object} query - Query object for filtering reminders
 * @returns {Promise<Array>} - Array of reminders
 */
async function fetchReminders(query = {}) {
    try {
        return await Reminder.find(query);
    } catch (err) {
        throw new Error(`Error fetching reminders: ${err.message}`);
    }
}

/**
 * Delete a reminder by ID
 * @param {string} id - The ID of the reminder to delete
 * @returns {Promise<Object|null>} - The deleted reminder, or null if not found
 */
async function deleteReminderById(id) {
    try {
        return await Reminder.findOneAndDelete({ id });
    } catch (err) {
        throw new Error(`Error deleting reminder: ${err.message}`);
    }
}

export {
    saveReminder,
    fetchReminders,
    deleteReminderById
};