const express = require("express");
const events = express.Router();

const { getAllEvents, getEvent, createEvent, deleteEvent } = require("../queries/Events");


//! GET ALL EVENTS
events.get("/", async (req, res) => {
    const allEvents = await getAllEvents();
    if (allEvents[0]) {
        res.status(200).json(allEvents);
    } else {
        res.status(500).json({ error: "server error!"});
    }
});


//! GET ONE EVENT
events.get("/:id", async (req, res) => {
    const { id } = req.params;
    const event = await getEvent(id);
    if (!event.message) {
        res.json(event);
    } else {
        res.status(500).json({ error: "Event not found!"});
    }
});


//! CREATE A NEW EVENT
events.post("/", async (req, res) => {
    try {
        const event = await createEvent(req.body);
        res.json(event);
    } catch (error) {
        res.status(400).json({ error: error });
    }
});


//! DELETE AN EVENT
events.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const event = await deleteEvent(id);
    if (event.id) {
        res.status(200).json(deleteEvent);
    } else {
        res.status(404).json({ error: "Event not found!"});
    }
});

//! UPDATE AN EVENT


module.exports = events;