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

    } catch (err) {
        console.error('Database connection error:', err.message);
        throw err;
    }
}

module.exports = connectDB;