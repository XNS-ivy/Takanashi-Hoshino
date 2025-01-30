import { start } from './modules/waSockets/waSocket.js'
import { connectMongoDB } from './modules/mongodb/mongoConnection.js'

await connectMongoDB().catch((error) => {
    console.error(error)
    process.exit(1)
})
await start().catch((error) => {
    console.error(error)
    process.exit(1)
})