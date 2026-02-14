require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const connectDB = require('./configs/db');
const app = require('./app');
const { startNotificationScheduler } = require('./services/notificationService');

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const PORT = process.env.PORT || 5000;

// Start server first so Render health checks pass
app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});

// Connect DB after server is up
connectDB()
    .then(() => {
        startNotificationScheduler();
        console.log('All services started');
    })
    .catch((err) => {
        console.error('DB connection failed:', err.message);
    });