import moment from 'moment'

export async function handlingReminder(args) {
    if (!Array.isArray(args) || args.length === 0) {
        return 'Invalid input: args must be a non-empty array.'
    }

    const currentTime = moment()
    let reminderTime = currentTime.clone().add(1, 'minute')
    let task = args.slice(0, -1).join(' ')
    const possibleTimeArg = args[args.length - 1].toLowerCase()

    if (/^\d+[smhdy]$/.test(possibleTimeArg)) {
        const value = parseInt(possibleTimeArg.slice(0, -1), 10)
        const unit = { s: 'seconds', m: 'minutes', h: 'hours', d: 'days', y: 'years' }[possibleTimeArg.slice(-1)]
        reminderTime = currentTime.clone().add(value, unit)
    } else if (/^\d{1,2}:\d{2}$/.test(possibleTimeArg)) {
        const [hour, minute] = possibleTimeArg.split(':').map(Number)
        reminderTime = currentTime.clone().hours(hour).minutes(minute).seconds(0)
        reminderTime = reminderTime.isBefore(currentTime) ? reminderTime.add(1, 'days') : reminderTime
    } else if (moment(possibleTimeArg, ['D MMM YYYY HH:mm', 'D MMM YYYY', 'DD MM YYYY', 'D MMMM YYYY HH:mm', 'D MMMM YYYY'], true).isValid()) {
        reminderTime = moment(possibleTimeArg, ['D MMM YYYY HH:mm', 'D MMM YYYY', 'DD MM YYYY', 'D MMMM YYYY HH:mm', 'D MMMM YYYY'], true)
    } else {
        task = args.join(' ')
    }

    if (!reminderTime.isValid()) {
        return 'Invalid time format'
    }

    return { task, date: reminderTime.format('YYYY-MM-DD HH:mm:ss') }
}

// Example usage
// console.log(await handlingReminder(['need', 'money', '1m'])); // { task: 'need money', date: '...' }
// console.log(await handlingReminder(['meeting', '10:30'])); // { task: 'meeting', date: '...' }
// console.log(await handlingReminder(['birthday', 'party', '12 July 2025'])); // { task: 'birthday party', date: '...' }
// console.log(await handlingReminder(['invalid', 'format'])); // { task: 'invalid format', date: '...' }