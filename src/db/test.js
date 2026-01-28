import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

async function test() {
    try {
            await mongoose.connect(process.env.MONGO_URI);
            console.log("Connected to MongoDB");

            const db = mongoose.connection.collection('users');
            const bday = '04-11-2002';
            const [month, day, year] = bday.trim().split('-').map(Number);
            const date = new Date(year, month - 1, day);
            console.log(`Date object: ${date}`);
            const user = new User({
                        userId: 'monshoo',
                        serverId: '1183565312776486992',
                        birthday: date
                    });
            await user.save();

    } catch ( err ) {
            console.error(err);
    } finally {
              await mongoose.disconnect();
              console.log("Disconnected from MongoDB");
    }
}

test();