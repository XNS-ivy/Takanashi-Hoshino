import Reminder from './reminderModel.js'

/**
 * Save a reminder to the database
 * @param {Object} reminderData - The reminder details
 * @param {string} reminderData.user - The user ID (remoteJid) who created the reminder
 * @param {string} reminderData.task - The task or description of the reminder
 * @param {string} reminderData.reminderDate - The date and time for the reminder in 'YYYY-MM-DD HH:mm:ss' format
 * @param {number} [reminderData.ephemeralExpiration=0] - Ephemeral expiration duration in seconds
 * @returns {string} - The ID of the saved reminder document
 */
export async function saveReminder(reminderData) {
    try {
        const { user, task, reminderDate, ephemeralExpiration = 0 } = reminderData;

        // Validate required fields
        if (!user || !task || !reminderDate) {
            throw new Error('Missing required fields: user, task, or reminderDate');
        }

        // Create a new reminder document
        const reminder = new Reminder({
            user,
            task,
            reminderDate,
            ephemeralExpiration,
        });

        // Save the reminder to the database
        const savedReminder = await reminder.save();
        console.log(`Reminder saved: ${savedReminder._id}`);

        // Return the ID of the saved reminder
        return savedReminder._id;
    } catch (error) {
        console.error('Error saving reminder:', error);
        throw new Error('Failed to save reminder');
    }
}

/**
 * Find reminders by criteria
 * @param {Object} filter - The criteria to search for reminders
 * @returns {Array} - List of reminders matching the filter
 */
export async function findReminders(filter = {}) {
    try {
        const reminders = await Reminder.find(filter);
        return reminders;
    } catch (error) {
        console.error('Error finding reminders:', error);
        throw new Error('Failed to find reminders');
    }
}

/**
 * Update a reminder's status
 * @param {string} reminderId - The ID of the reminder to update
 * @param {Object} updateData - The data to update in the reminder
 * @returns {Object} - The updated reminder document
 */
export async function updateReminder(reminderId, updateData) {
    try {
        const updatedReminder = await Reminder.findByIdAndUpdate(reminderId, updateData, { new: true })
        if (!updatedReminder) {
            throw new Error(`Reminder with ID ${reminderId} not found`)
        }
        return updatedReminder
    } catch (error) {
        console.error('Error updating reminder:', error)
        throw new Error('Failed to update reminder')
    }
}