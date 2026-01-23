import 'dotenv/config';
import mongoose from 'mongoose';

async function inspectDatabase() {
    try {
            await mongoose.connect(process.env.MONGO_URI);
            console.log("Connected to MongoDB");

            const db = mongoose.connection.db;
            const collections = await db.listCollections().toArray();

            for (const cur of collections) {
                console.log(`${cur.name}`);
                const sample = await db.collection(cur.name).findOne();
                if( !sample ) {
                    console.log("No document found");
                    continue;
                } else {
                    const count = await db.collection(cur.name).countDocuments();
                    console.log(`Collection: ${cur.name} → ${count} document(s)`);
                }

                for (const key of Object.keys(sample)) {
                    console.log(` ${key}: ${typeof sample[key]}`)
                }
            }

            await mongoose.disconnect();
            console.log("\nExit");
    } catch ( err ) {
        console.error(err);
    }
}

inspectDatabase();