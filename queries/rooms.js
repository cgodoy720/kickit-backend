const db = require("../db/dbConfig");

const getAllRooms = async (loggedInUserId) => {
  try {
    const rooms = await db.any(
      "SELECT DISTINCT r.id, r.user1_id, r.user2_id, r.added, " +
      "CASE " +
      "  WHEN r.user1_id = $1 THEN u2.username " +
      "  ELSE u1.username " +
      "END AS other_username " +
      "FROM rooms r " +
      "JOIN users u1 ON u1.id = r.user1_id " +
      "JOIN users u2 ON u2.id = r.user2_id " +
      "WHERE (r.user1_id = $1 AND r.user2_id != $1) OR (r.user1_id != $1 AND r.user2_id = $1)",
      [loggedInUserId]
    );
    return rooms;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch rooms.");
  }
};


const getRoomById = async (roomId) => {
  try{

    const room = await db.one(`SELECT * FROM rooms where id=$1`, roomId)

    return room
  }

  catch(error){
    console.log(error)
    return error
  }
}


const makeNewRoom = async (user1_id, user2_id) => {
  try {
    const checkRoom = await db.oneOrNone(
      "SELECT * FROM rooms WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)",
      [user1_id, user2_id]
    );

    if (checkRoom !== null) {
      throw new Error("Room already exists.");
    } else {
      const newRoom = await db.one(
        "INSERT INTO rooms (user1_id, user2_id, added) VALUES ($1, $2, $3) RETURNING *",
        [user1_id, user2_id, true]
      );
      return newRoom;
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create a new room.");
  }
};

module.exports = {
  getAllRooms,
  makeNewRoom,
  getRoomById
};


