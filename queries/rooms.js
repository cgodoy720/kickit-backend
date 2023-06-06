const db = require("../db/dbConfig");


const getAllRooms = async () => {
  try {
      const rooms = await db.any("SELECT rooms.user1_id, rooms.user2_id, rooms.added, users.username FROM rooms JOIN users ON users.id = rooms.user1_id OR users.id = rooms.user2_id")
      return rooms
  } catch (error) {
      console.log(error);
      return error;
  }
}


const getRooms = async (user1_id, user2_id) => {
  try {
    const roomsList = await db.manyOrNone(`
      SELECT *
      FROM rooms
      WHERE (user1_id = ${user1_id} AND user2_id = ${user2_id})
        OR (user1_id = ${user2_id} AND user2_id = ${user1_id})`);

    return roomsList;
  } catch (error) {
    console.log(error);
    return error;
  }
};


const makeNewRoom = async (user1_id, user2_id) => {
  try {
    const checkRoom = await db.oneOrNone(`
      SELECT *
      FROM rooms
      WHERE (user1_id = ${user1_id} AND user2_id = ${user2_id})
        OR (user1_id = ${user2_id} AND user2_id = ${user1_id})`);

    if (checkRoom !== null) {
      return { error: "Room already exists" };
    } else {
      const newRoom = await db.one(
        "INSERT INTO rooms (user1_id, user2_id, added) VALUES ($1, $2, $3) RETURNING *",
        [user1_id, user2_id, true]
      );
      return newRoom;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = {
  getAllRooms,
  getRooms,
  makeNewRoom
}

