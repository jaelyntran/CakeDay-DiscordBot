import 'dotenv/config';
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URI);

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    serverId: { type: String, required: true },
    birthday: { type: Date, default: null },
});
userSchema.index({ userId: 1, serverId: 1 }, { unique: true });
export default mongoose.model('User', userSchema);