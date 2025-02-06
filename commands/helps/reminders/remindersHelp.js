import fs from 'fs'

const config = JSON.parse(fs.readFileSync('./hoshinoConfig.json', 'utf-8'))
const prefix = config.prefix

export default {
    name: 'remind',
    type: 'helps',
    queries: ['add', 'delete', 'list'],
    execute: (args) => {
        const query = args[0]
        let description = 'Provides usage details for the remind command.'
        let usage = prefix + 'reminder `query` `task_name` - `time_format`'
        let example = prefix + '`reminder add Homework - 2h`'

        if (query) {
            usage = query === 'add'
                ? prefix + 'reminder `add` `task_name` - `time_format`'
                : query === 'delete'
                    ? prefix + 'reminder `delete` `task_name`'
                    : query === 'list'
                        ? 'reminder `list`'
                        : usage

            example = query === 'add'
                ? 'reminder add Homework - 2h'
                : query === 'delete'
                    ? 'reminder delete Homework'
                    : query === 'list'
                        ? 'reminder list'
                        : example
        }

        return { description, usage, example }
    }
}