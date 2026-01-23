import 'dotenv/config';
import mongoose from 'mongoose';

async function dropDatabase() {
    try {
            await mongoose.connect(process.env.MONGO_URI);
            console.log("Connected to MongoDB");

            await mongoose.connection.collection('users').drop();
            console.log('✅ users collection dropped');

            await mongoose.disconnect();
            console.log("\nExit");
    } catch ( err ) {
        console.error(err);
    }
}

dropDatabase();