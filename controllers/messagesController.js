const express = require("express");
const messages = express.Router({mergeParams:true});

const { getAllMessages, sendMessage, deleteMessage } = require("../queries/Messages");

// GET route to retrieve all messages from a room
messages.get("/", async (req, res) => {
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

messages.delete("/:id/delete", async (req , res) => {
  const { id } = req.params;
  const message = await deleteMessage(id);
  if (message.id) {
      res.status(200).json(message);
  } else {
      res.status(404).json({ error: "Message not found!"});
  }
})


module.exports = messages;
// {
//   "roomId": 1,
//   "senderId": 1,
//   "receiverId": 2,
//   "content": "Hello, how are you?"
// }