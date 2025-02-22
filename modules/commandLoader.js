import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

async function loadCommands(dir = './commands') {
    const commands = new Map()

    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
        const fullPath = path.resolve(dir, file.name)
        if (file.isDirectory()) {
            const subCommands = await loadCommands(fullPath)
            for (const [key, value] of subCommands) {
                commands.set(key, value);
            }
        } else if (file.name.endsWith('.js')) {
            const fileUrl = pathToFileURL(fullPath).href
            try {
                const module = await import(fileUrl)
                if (module.default && module.default.name) {
                    if (module.default.type === 'helps') {
                        continue
                    }
                    commands.set(module.default.name, module.default)
                }
            } catch (err) {
                console.error(`Error importing command from ${fileUrl}:`, err)
            }
        }
    }
    return commands
}

export { loadCommands }