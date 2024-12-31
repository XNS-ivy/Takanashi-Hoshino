export async function handleHelp(message, commands) {
    const helpCommand = commands.get('menu');
    if (helpCommand) {
        await helpCommand.execute(message);
    } else {
        message.reply("Sorry, I couldn't find the help menu.")
    }
}

export async function handlePrefix(message) {
    await message.reply(`Prefix now is : \`${process.env.prefix}\` Sensei..`)
}

export async function handleMessage(message, commands) {
    const lowerContent = message.content.toLowerCase()

    if (lowerContent === 'help') {
        const helpCommand = commands.get('menu')
        if (helpCommand) {
            await helpCommand.execute(message)
        } else {
            message.reply("Sorry, I couldn't find the help menu.")
        }
        return true
    }

    if (lowerContent === 'prefix') {
        await message.reply(`Prefix now is : \`${process.env.prefix}\` Sensei..`)
        return true
    }

    return false
}
