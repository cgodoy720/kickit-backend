const express = require("express");
const rooms = express.Router();

const { getAllRooms, getRooms, makeNewRoom } = require("../queries/rooms");



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


// rooms.get("/:user1_id/:user2_id", async (req, res) => {
//   try {
//     const {user1_id, user2_id} = req.params;
  
//     let roomsList = await getRooms(user1_id, user2_id);
//     res.status(200).json(roomsList)
//   } catch (error) {
//     res.status(500).json({ error: error });
//   }
// });



rooms.post("/:user1_id/new/:user2_id", async (req, res) => {
  try {

    const {user1_id, user2_id} = req.params;

    let newRoom = await makeNewRoom(user1_id, user2_id);
    res.status(200).json(newRoom);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});


module.exports = rooms;

