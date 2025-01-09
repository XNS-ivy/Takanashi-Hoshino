import { start } from './modules/waSocket.js'
import { connectMongoDB } from './modules/connMongo.js'

connectMongoDB().catch((error) => console.error(error))
start().catch((error) => console.error(error))