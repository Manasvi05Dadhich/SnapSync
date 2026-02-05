const express = require('express');
const mongoose = require('mongoose');



const connectDB= async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('database connected');
        
    } catch (err) {
        console.log(err);
        console.log('error in connecting');
        process.exit(1);
    }
}

module.exports= connectDB;