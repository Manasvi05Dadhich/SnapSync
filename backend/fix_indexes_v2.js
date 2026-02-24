const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const logFile = 'fix_log.txt';
function log(msg) {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
}

async function run() {
    fs.writeFileSync(logFile, 'Starting fix...\n');
    try {
        log('Connecting to: ' + process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        log('Connected!');

        const db = mongoose.connection.db;
        const collection = db.collection('users');

        log('Dropping index googleId_1...');
        try {
            await collection.dropIndex('googleId_1');
            log('Successfully dropped googleId_1');
        } catch (e) {
            log('Error dropping googleId_1 (maybe already gone?): ' + e.message);
        }

        log('Dropping index googleId_1_unique...');
        try {
            await collection.dropIndex('googleId_1_unique');
            log('Successfully dropped googleId_1_unique');
        } catch (e) {
            log('Error dropping googleId_1_unique: ' + e.message);
        }

        log('Fetching remaining indexes...');
        const indexes = await collection.indexes();
        log('Current indexes: ' + JSON.stringify(indexes, null, 2));

        log('DONE');
        process.exit(0);
    } catch (err) {
        log('CRITICAL ERROR: ' + err.stack);
        process.exit(1);
    }
}

run();
