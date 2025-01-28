import fs from 'fs'

const config = JSON.parse(fs.readFileSync('./shirokoConfig.json', 'utf-8'))
const prefix = config.prefix

export default {
    name: 'remind',
    type: 'helps',
    queries: ['add', 'delete', 'list'],
    execute: (args) => {
        const query = args[0]
        let description = 'Provides usage details for the remind command.'
        let usage = prefix + 'remind `query` `task_name` - `time_format`'
        let example = prefix + '`remind add Homework - 2h`'

        if (query) {
            usage = query === 'add'
                ? prefix + 'remind `add` `task_name` - `time_format`'
                : query === 'delete'
                    ? prefix + 'remind `delete` `task_name`'
                    : query === 'list'
                        ? 'remind `list`'
                        : usage

            example = query === 'add'
                ? 'remind add Homework - 2h'
                : query === 'delete'
                    ? 'remind delete Homework'
                    : query === 'list'
                        ? 'remind list'
                        : example
        }

        return { description, usage, example }
    }
}