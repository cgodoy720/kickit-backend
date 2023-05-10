const express = require("express");

const comm = require("./commentController")

const events = express.Router();

const { getAllEvents, 
    getEvent, 
    createEvent, 
    deleteEvent, 
    addCategory,
    deleteCategoryFromEvent,
    updateEvent } = require("../queries/Events");


events.use("/:eventId/comments", comm)



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
        res.status(200).json(event);
    } else {
        res.status(404).json({ error: "Event not found!"});
    }
});


//Delete Category From Event
events.delete("/:eventId/categories/:categoryId", async (req , res) => {
    const {eventId , categoryId} = req.params
    
        const deleteCategory = await deleteCategoryFromEvent(eventId, categoryId)
        if(deleteCategory.id){
            res.status(200).json(deleteCategory)
        }
        else{
            res.status(404).json({ error: "Event category not found!"});
        }
    
})


//Add Category to Event

events.post("/:eventId/categories", async (req, res) => {
    const { eventId} = req.params;
    const { category } = req.body;
    try {
        const event = await addCategory(eventId, category);
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: "Server error!" });
    }
});



//! UPDATE AN EVENT

events.put("/:id", async (req , res) => {
    const {id} = req.params;

    const updatedEvent = await updateEvent(id, req.body);

    res.status(200).json(updatedEvent);
})



module.exports = events;