import { EmbedBuilder } from 'discord.js'
import { wiki } from '../../modules/wiki.js'

export default {
    name: 'wiki',
    description: 'Fetch articles from Wikipedia',
    menu: 'wikipedia',
    type: 'main',
    execute: async (message, args) => {
        if (!args.length) {
            return message.reply(
                `Please provide a country code and a search query.\nExample: \`${process.env.prefix}wiki en France\``
            )
        }

        const country = args[0];
        const query = args.slice(1).join(' ')

        try {
            const article = await wiki(country, query)

            if (typeof article === 'string') {
                return message.reply(article)
            }

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(article.title)
                .setURL(`https://${country}.wikipedia.org/wiki/${encodeURIComponent(article.title)}`)
                .setDescription(
                    article.body.length > 4096
                        ? `${article.body.slice(0, 4000)}...\n\n[Read more](https://${country}.wikipedia.org/wiki/${encodeURIComponent(
                              article.title
                          )})`
                        : article.body
                )
                .setFooter({ text: 'Data fetched from Wikipedia', iconURL: 'https://en.wikipedia.org/static/favicon/wikipedia.ico' })

            return message.reply({ embeds: [embed] })
        } catch (error) {
            console.error('Error while executing the wiki command:', error)
            return message.reply('An error occurred while fetching the article. Please try again later.')
        }
    },
}