import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

/**
 * @function connectMongoDB - connecting to mongodb if not connected stop the code
 * @constant {string} uri - mongodb connection string from .env mongo_uri=
 * @function mongoose.connect(uri) - connect to mongodb
 */

async function connectMongoDB() {
    const uri = process.env.mongo_uri

    try {
        await mongoose.connect(uri)
        console.log('Connected to MongoDB Atlas')
    } catch (err) {
        console.error('Failed to connect to MongoDB Atlas:', err)
        process.exit(1)
    }
}

export { connectMongoDB }