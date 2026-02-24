const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
    try {
        console.log('Connecting...');
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        const collection = db.collection('users');

        console.log('Fetching indexes...');
        const indexes = await collection.indexes();
        console.log('Current indexes:', indexes.map(i => i.name));

        const googleIdIndex = indexes.find(i => i.name.includes('googleId') || i.key.googleId);
        if (googleIdIndex) {
            console.log('Dropping index:', googleIdIndex.name);
            await collection.dropIndex(googleIdIndex.name);
            console.log('Index dropped!');
        } else {
            console.log('No googleId index found.');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

run();
