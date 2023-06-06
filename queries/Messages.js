const db = require("../db/dbConfig");

const getAllMessages = async (roomId) => {
    try {
        const messages = await db.any("SELECT * FROM message WHERE rooms_id=$1", roomId)
        return messages
    } catch (error) {
        console.log(error);
        return error;
    }
}

const sendMessage = async (roomId, user1Id, user2Id, content) => {
    try {
      const newMessage = await db.one(
        "INSERT INTO message (rooms_id, user1_id, user2_id, content) VALUES ($1, $2, $3, $4) RETURNING *",
        [roomId, user1Id, user2Id, content]
      );
      return newMessage;
    } catch (error) {
      console.log(error);
      return error;
    }
  };


module.exports = { getAllMessages, sendMessage }