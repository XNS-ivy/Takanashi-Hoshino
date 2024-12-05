import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default {
    name: 'info',
    description: 'Displays a hoshino information Sensei.',
    async execute(message) {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('info')
                    .setLabel('Info')
                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                    .setCustomId('support')
                    .setLabel('Support')
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setLabel('GitHub')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://github.com/your-username')
            )
        await message.reply({
            content: 'Welcome to my information, Sensei!',
            components: [row],
        });
    },
};
