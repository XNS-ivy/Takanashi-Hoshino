export default {
    name: 'menu',
    description: 'To Show All Available Commands. Sensei..',
    execute: async (message) => {
        const commands = message.client.commands.map(cmd => `\`${process.env.prefix}${cmd.name}\`: ${cmd.description || 'Description not available.'}`).join('\n');

        await message.reply({
            content: `**Here Command List Sensei.. :**\n${commands}`,
            allowedMentions: { repliedUser: true },
        });
    },
};
