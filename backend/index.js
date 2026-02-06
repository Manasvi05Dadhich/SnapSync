require('dotenv').config();
const express = require('express');
const connectDB= require('./configs/db');
const app = require('./app');

connectDB();
app.listen(process.env.PORT, ()=>{
    console.log(`server running on ${process.env.PORT}`);
});