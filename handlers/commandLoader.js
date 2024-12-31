import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

/**
 * Function to recursively read command files from directories
 * @param {string} dir - The directory to read
 * @returns {Array<string>} - Array of file paths
 */
function getCommandFiles(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true })
    const commandFiles = []
    for (const file of files) {
        const filePath = path.join(dir, file.name)
        if (file.isDirectory()) {
            commandFiles.push(...getCommandFiles(filePath))
        } else if (file.isFile() && file.name.endsWith('.js')) {
            commandFiles.push(filePath)
        }
    }
    return commandFiles
}

/**
 * Load commands into the bot
 * @param {Collection} commands - The bot's commands collection
 * @param {string} commandsPath - Path to the commands directory
 */
export async function loadCommands(commands, commandsPath) {
    const commandFiles = getCommandFiles(commandsPath);
    for (const file of commandFiles) {
        const command = (await import(pathToFileURL(file))).default
        if (command && command.name) {
            commands.set(command.name, command)
        } else {
            console.warn(`Command file ${file} is missing a valid 'name' property.`)
        }
    }
}