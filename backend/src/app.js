const express = require("express");
const cors = require("cors");
const profileRoutes=require('./routes/profileRoutes.js');
const eventRoutes=require('./routes/eventRoutes.js');


const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/profiles', profileRoutes);
app.use('/api/events', eventRoutes);


module.exports = app;
