import 'dotenv/config'
import { MongoClient } from 'mongodb'

const mongoClient = new MongoClient(process.env.mongo_url)
 async function connectDatabase() {
    try {
        await mongoClient.connect()
    } catch (error) {
      console.error('Error connecting to MongoDB:', error)
    }
 }

 export {
    connectDatabase
 }