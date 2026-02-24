const express = require('express');
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            tls: true,
            tlsAllowInvalidCertificates: false,
            tlsAllowInvalidHostnames: false
        });
        console.log('database connected');

        // Drop problematic unique index on googleId if it exists
        try {
            const db = mongoose.connection.db;
            const collection = db.collection('users');
            const indexes = await collection.indexes();
            if (indexes.some(idx => idx.name === 'googleId_1')) {
                console.log('Dropping unique googleId_1 index...');
                await collection.dropIndex('googleId_1');
                console.log('Index dropped successfully');
            }
        } catch (indexErr) {
            console.log('Non-critical: Could not drop index (might already be gone):', indexErr.message);
        }

    } catch (err) {
        console.error('Database connection error:', err.message);
        throw err;
    }
}

module.exports = connectDB;