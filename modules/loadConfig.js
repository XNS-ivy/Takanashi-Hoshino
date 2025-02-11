import fs from 'fs'
const config = await JSON.parse(fs.readFileSync('./hoshinoConfig.json'))

export default config