import 'dotenv/config';
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URI);

const serverSchema = new mongoose.Schema({
    serverId: { type: String, required: true, unique: true },
    lastBirthdayAnnouncement: { type: String, default: null }
});

export default mongoose.model('Server', serverSchema);