export function initMessage(message, query){
    const messageBody = {
        id: message.author.id,
        name: message.author.username,
        message: query.join(' ')
    }
    return messageBody
}