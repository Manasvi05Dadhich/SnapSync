const express = require('express');
const cors = require('cors');
const itemRoutes = require('./routes/item.routes');
const extractRoutes = require("./routes/extract.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/items', itemRoutes);

app.use("/api/extract", extractRoutes);
module.exports=app;