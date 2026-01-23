import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

async function inspectDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB\n");

        const users = await User.find();
        console.log(`📂 Total documents in 'users' collection: ${users.length}\n`);

        users.forEach((user, index) => {
            console.log(`Document #${index + 1}:`);
            console.log(`  _id       : ${user._id}`);
            console.log(`  userId    : ${user.userId}`);
            console.log(`  serverId  : ${user.serverId}`);
            if (user.birthday) {
                console.log(`  birthday  : ${user.birthday.toISOString().slice(0, 10)} (Date object? ${user.birthday instanceof Date})`);
            } else {
                console.log(`  birthday  : null`);
            }
            console.log(`  __v       : ${user.__v}\n`);
        });

        await mongoose.disconnect();
        console.log("✅ Disconnected from MongoDB\nExit");
    } catch (err) {
        console.error(err);
    }
}

inspectDatabase();