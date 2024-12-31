import 'dotenv/config';
import mongoose from 'mongoose';

async function connectDatabase() {
   try {
      await mongoose.connect(process.env.mongo_uri, {
         serverSelectionTimeoutMS: 500000,
      });
      console.log('Successfully connected to MongoDB')
   } catch (error) {
      console.error('Error connecting to MongoDB:', error.message)
   }
}

export {
   connectDatabase,
}