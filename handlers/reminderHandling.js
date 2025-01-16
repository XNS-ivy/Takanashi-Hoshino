import moment from 'moment'

export async function handlingReminder(args) {
    if (!Array.isArray(args) || args.length === 0) {
        return 'Invalid input: args must be a non-empty array.'
    }

    let task = ''
    const timeRegex = /(\d+)([smhdMy])/g
    let match;
    const unitsSeen = new Set()
    let timePartDetected = false

    for (let i = 0; i < args.length; i++) {
        const possibleTimeArg = args[i].toLowerCase()
        if (timeRegex.test(possibleTimeArg)) {
            timePartDetected = true
            while ((match = timeRegex.exec(possibleTimeArg)) !== null) {
                const value = parseInt(match[1], 10)
                const unitChar = match[2]
                const unit = {
                    s: 'seconds',
                    m: 'minutes',
                    h: 'hours',
                    d: 'days',
                    y: 'years',
                    M: 'months',
                }[unitChar]

                if (unitsSeen.has(unitChar)) {
                    return `Duplicate time unit detected: ${unitChar} is used more than once.`
                }

                if (unit) {
                    unitsSeen.add(unitChar)
                } else {
                    return 'Invalid time unit'
                }
            }
        } else {
            if (timePartDetected) {
                task += args.slice(i).join(' ')
                break
            } else {
                task += args[i] + ' '
            }
        }
    }

    if (!task.trim()) {
        return 'No task specified. Please provide a task before the time.'
    }

    const currentTime = moment()
    let reminderTime = currentTime.clone().add(1, 'minute')

    if (timePartDetected) {
        for (let i = 0; i < args.length; i++) {
            const possibleTimeArg = args[i].toLowerCase()
            if (timeRegex.test(possibleTimeArg)) {
                while ((match = timeRegex.exec(possibleTimeArg)) !== null) {
                    const value = parseInt(match[1], 10)
                    const unitChar = match[2]
                    const unit = {
                        s: 'seconds',
                        m: 'minutes',
                        h: 'hours',
                        d: 'days',
                        y: 'years',
                        M: 'months',
                    }[unitChar]

                    if (unit) {
                        reminderTime = reminderTime.add(value, unit)
                    }
                }
            }
        }
    }

    if (!reminderTime.isValid()) {
        return 'Invalid time format'
    }

    return { task: task.trim(), date: reminderTime.format('YYYY-MM-DD HH:mm:ss') }
}

// Example usage
// console.log(await handlingReminder(['need', 'money', '9h', '20m', '1d'])); // { task: 'need money', date: '...' }
// console.log(await handlingReminder(['meeting', '10:30'])); // { task: 'meeting', date: '...' }
// console.log(await handlingReminder(['birthday', 'party', '12 July 2025'])); // { task: 'birthday party', date: '...' }
// console.log(await handlingReminder(['invalid', 'format'])); // { task: 'invalid format', date: '...' }
// console.log(await handlingReminder(['project', 'deadline', '3d', '4h'])); // { task: 'project deadline', date: '...' }
// console.log(await handlingReminder(['long', 'vacation', '2y', '5m'])); // { task: 'long vacation', date: '...' }
// console.log(await handlingReminder(['need', 'money', '1m', '5s'])); // { task: 'need money', date: '...' }
// console.log(await handlingReminder(['1m', '1s'])); // 'No task specified. Please provide a task before the time.'