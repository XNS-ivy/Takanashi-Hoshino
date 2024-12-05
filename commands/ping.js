export default {
    name: 'ping',
    description: 'Ping the bot',
    usage: 'ping',
    execute(message){
        message.reply('Pong!')
    }
}