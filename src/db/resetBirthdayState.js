import mongoose from 'mongoose';
import Server from '../models/Server.js';
import 'dotenv/config';

await mongoose.connect(process.env.MONGO_URI);

await Server.updateMany(
    {},
    { $set: { lastBirthdayAnnouncement: null } }
);

console.log("✅ Reset lastBirthdayAnnouncement for all servers");

await mongoose.disconnect();