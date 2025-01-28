import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

/**
 * Loads sub-commands with type "helps" from a specified directory.
 * @param {string} dir The directory to load sub-commands from.
 * @returns {Promise<Map<string, any>>} A Map of sub-command names and their corresponding modules.
 */
export async function loadSubCommand(dir = './commands') {
    const subCommands = new Map()

    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
        const fullPath = path.resolve(dir, file.name)
        if (file.isDirectory()) {
            const subSubCommands = await loadSubCommand(fullPath)
            for (const [key, value] of subSubCommands) {
                subCommands.set(key, value)
            }
        } else if (file.name.endsWith('.js')) {
            const fileUrl = pathToFileURL(fullPath).href
            try {
                const module = await import(fileUrl)
                if (module.default && module.default.name && module.default.type === 'helps') {
                    subCommands.set(module.default.name, module.default)
                }
            } catch (err) {
                console.error(`Error importing sub-command from ${fileUrl}:`, err)
            }
        }
    }
    return subCommands
}