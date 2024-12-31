import { EmbedBuilder } from 'discord.js'

export default {
    name: 'menu',
    description: 'To Show All Available Commands, Sensei..',
    type: 'dontDisplay',
    execute: async (message) => {
        const commands = message.client.commands

        // Organize commands by menu and type
        const commandCategories = {};
        commands.forEach(cmd => {
            if (!cmd.menu || !cmd.type || cmd.type === 'dontDisplay') return

            if (!commandCategories[cmd.menu]) {
                commandCategories[cmd.menu] = { main: [], sub: [] }
            }
            commandCategories[cmd.menu][cmd.type].push(cmd)
        })

        // Build embed
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Available Commands')
            .setDescription('Here is a list of commands organized by category, Sensei.')

        Object.keys(commandCategories).forEach(menu => {
            const { main, sub } = commandCategories[menu]

            // Combine main and subcommands in a single field
            const commandsList = main.map(mainCmd => {
                // Find subcommands related to this main command
                const relatedSubCommands = sub
                    .filter(subCmd => subCmd.menu === mainCmd.menu)
                    .map(subCmd => `\t\`${process.env.prefix}${subCmd.name}\`: ${subCmd.description || 'No description'}`)
                    .join('\n')

                return `\`${process.env.prefix}${mainCmd.name}\`: ${mainCmd.description || 'No description'}\n${relatedSubCommands}`
            }).join('\n')

            embed.addFields([
                { name: `**${menu.toUpperCase()}**`, value: commandsList || '*No commands available.*' },
            ])
        });

        // Send embed
        await message.reply({ embeds: [embed] })
    },
}