const db = require("../db/dbConfig");

const getAllMessages = async (roomId) => {
  try {
    const messages = await db.any(
      `SELECT m.content, m.user1_id AS userId, m.user2_id AS
       receiverId FROM message m INNER JOIN rooms r ON m.rooms_id = r.id 
       WHERE m.rooms_id = $1`,
      [roomId]
    );
    return messages;
  } catch (error) {
    console.log(error);
    return error;
  }
};


const sendMessage = async (roomId, senderId, receiverId, content) => {
  try {
    const newMessage = await db.one(
      "INSERT INTO message (rooms_id, user1_id, user2_id, content) VALUES ($1, $2, $3, $4) RETURNING *",
      [roomId, senderId, receiverId, content]
    );
    return newMessage;
  } catch (error) {
    console.log(error);
    return error;
  }
};


module.exports = { getAllMessages, sendMessage }