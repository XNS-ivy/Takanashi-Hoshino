import { EmbedBuilder } from 'discord.js';

export default {
    name: 'menu',
    description: 'To Show All Available Commands, Sensei..',
    type: 'dontDisplay',
    execute: async (message) => {
        const commands = message.client.commands

        // Organize commands by menu and type
        const commandCategories = {}
        commands.forEach(cmd => {
            if (!cmd.menu || !cmd.type || cmd.type === 'dontDisplay') return

            if (!commandCategories[cmd.menu]) {
                commandCategories[cmd.menu] = { main: [], sub: [] }
            }
            commandCategories[cmd.menu][cmd.type].push(cmd)
        });

        // Build embed
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Available Commands')
            .setDescription('Here is a list of commands organized by category, Sensei.')

        Object.keys(commandCategories).forEach(menu => {
            const { main, sub } = commandCategories[menu]
            let mainCommands = main.map(cmd => `\`${process.env.prefix}${cmd.name}\`: ${cmd.description || 'No description'}`).join('\n')
            let subCommands = sub.map(cmd => `\`${process.env.prefix}${cmd.name}\`: ${cmd.description || 'No description'}`).join('\n')

            embed.addFields([
                { name: `**${menu.toUpperCase()}**`, value: mainCommands || '*No main commands available.*' },
                { name: '\u200B', value: subCommands ? `**Subcommands:**\n${subCommands}` : '\u200B', inline: true },
            ])
        })

        // Send embed
        await message.reply({ embeds: [embed] })
    },
};