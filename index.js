import { start } from './modules/waSocket.js'
import { connectMongoDB } from './modules/connMongo.js'

await connectMongoDB().catch((error) => console.error(error))
await start().catch((error) => console.error(error))