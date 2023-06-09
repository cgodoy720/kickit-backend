const express = require("express");
const rooms = express.Router();

const { getAllRooms, makeNewRoom, getRoomById} = require("../queries/rooms");

const message = require("./messagesController")

rooms.use("/:room_id/messages", message)


rooms.get("/:userId", async (req, res) => {

  const {userId} = req.params

  try {
    const allRooms = await getAllRooms(userId);
    if (allRooms && allRooms.length > 0) {
      res.status(200).json(allRooms);
    } else {
      res.status(500).json({ error: "Server error!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error!" });
  }
});

rooms.get("/:roomId/selected", async (req , res) => {
  const {roomId} = req.params

  try{

    const room = await getRoomById(roomId)

    if(room){
      res.status(200).json(room);
    }
  }

  catch(error){
    console.log(error);
    res.status(500).json({ error: "Server error!" });
  }
})


rooms.post("/:username1/new/:username2", async (req, res) => {
  try {
    const { username1, username2 } = req.params;

    let newRoom = await makeNewRoom(username1, username2);
    res.status(200).json(newRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = rooms;

