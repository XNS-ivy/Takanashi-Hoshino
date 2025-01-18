import moment from "moment"

export async function handlingReminder(args) {
    const querymap = {
        delete: args[0] === 'delete',
        add: args[0] === 'add',
        list: args[0] === 'list',
    }

    let task, time, errorMessage = null

    if (querymap?.add) {
        const input = args.slice(1).join(' ')
        const parts = input.split('-')
        task = parts[0]?.trim()

        if (parts[1]) {
            const timeInput = parts[1].trim()

            const specificTime = moment(timeInput, "DD MMMM YYYY", true)

            if (specificTime.isValid()) {
                time = specificTime.format("YYYY-MM-DD HH:mm:ss")
            } else {
                const timeRegex = /^(\d+)([smhdwMy])$/
                const match = timeInput.match(timeRegex)

                if (match) {
                    const value = parseInt(match[1], 10)
                    const unit = match[2]

                    time = moment().add(value, unit).format("YYYY-MM-DD HH:mm:ss")
                } else {
                    errorMessage = `Invalid time format: ${timeInput}. Use formats like "12 February 2025" or "20s, 1m, etc."`
                }
            }
        }
    } else if (querymap?.delete) {
        task = args.slice(1).join(' ')
    } else if (querymap?.list) {
        // Placeholder for query "list"
    }

    if (!querymap?.add || !querymap?.delete || !querymap?.list) {
        return `Invalid query. Use 'add', 'delete', or 'list' as the first argument`
    } else {
        return {
            task: task ?? false,
            time: time ?? false,
            error: errorMessage ?? null,
            query: querymap,
        }
    }
}