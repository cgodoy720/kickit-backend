const express = require("express");
const messages = express.Router();

const { getAllMessages, sendMessage } = require("../queries/Messages");

// GET route to retrieve all messages from a room
messages.get("/:room_id", async (req, res) => {
  try {
    const { room_id } = req.params;

    const messages = await getAllMessages(room_id);

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST route to send a message
messages.post("/:room_id", async (req, res) => {
  try {
    const { room_id } = req.params;
    const { user1_id, user2_id, content } = req.body;

    const newMessage = await sendMessage(room_id, user1_id, user2_id, content);

    res.status(200).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = messages;
