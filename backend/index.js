require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const connectDB = require('./configs/db');
const app = require('./app');
const { startNotificationScheduler } = require('./services/notificationService');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

connectDB().then(() => {
    startNotificationScheduler();
});

app.listen(process.env.PORT, () => {
    console.log(`server running on ${process.env.PORT}`);
});