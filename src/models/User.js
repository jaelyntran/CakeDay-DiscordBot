import 'dotenv/config';
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URI);

const userSchema = new mongoose.Schema({
    userId: { type: String, require: true, unique: true },
    serverId: { type: String, require: true }
    birthday: { type: Date }
});

module.exports = mongoose.model('User', userSchema);