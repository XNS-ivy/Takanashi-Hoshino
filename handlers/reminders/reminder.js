import moment from "moment"

export async function handlingReminder(args) {
    const querymap = {
        delete: args[0] === 'delete',
        add: args[0] === 'add',
    }

    let task, time, errorMessage = null

    if (querymap.add) {
        const input = args.slice(1).join(' ')
        const parts = input.split('-')
        task = parts[0]?.trim()

        if (parts[1]) {
            const timeInput = parts[1].trim()

            const specificTime = moment(timeInput, "DD MMMM YYYY", true)

            if (specificTime.isValid()) {
                time = specificTime.toISOString()
            } else {
                const timeRegex = /^(\d+)([smhdwMy])$/
                const match = timeInput.match(timeRegex)

                if (match) {
                    const value = parseInt(match[1], 10)
                    const unit = match[2]

                    time = moment().add(value, unit).toISOString()
                } else {
                    errorMessage = `Invalid time format: ${timeInput}. Use formats like "12 February 2025" or "20s, 1m, etc."`
                }
            }
        }
    } else if (querymap.delete) {
        task = args.slice(1).join(' ')
    }

    return {
        task: task ?? false,
        time: time ?? false,
        error: errorMessage ?? null
    }
}