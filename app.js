// DEPENDENCIES
const express = require('express');
const cors = require('cors');

// CONFIGURATION
const app = express();

// CONTROLLERS
const eventsController = require("./controllers/EventsController"); 

// MIDDLEWARE
app.use(cors());
app.use(express.json());


// ROUTES
app.get('/', (req, res) => {
    // res.send('Welcome to Team 2 - Capstone Project')
    res.json({ message: 'Welcome to Team 2 - Capstone Project'})
});

app.use("/events", eventsController);

app.get('*', (req, res) => {
    res.status(404).send('Not Found')
});

// EXPORT
module.exports = app;