const db = require("../db/dbConfig");

const getAllMessages = async (roomId) => {
  try {
    const messages = await db.any(
      `SELECT m.id, m.content, m.user1_id AS userId, m.user2_id AS
       receiverId, to_char(m.date_created, 'MM/DD/YYYY') AS date_created FROM message m INNER JOIN rooms r ON m.rooms_id = r.id
       WHERE m.rooms_id = $1
       ORDER BY m.date_created ASC`,
      [roomId]
    );

const userIds = messages.map((message) => {
  return message.userid
})

const usernames = await db.manyOrNone(
  `SELECT id, username FROM users WHERE id IN ($1:csv)`,
  [userIds]
);

const messageUsername = messages.map(message => {
  const username = usernames.find(user => user.id === message.userid)
  return{
    ...message, username: username ? username.username : null
  }
})

    return messageUsername
  } catch (error) {
    console.log(error);
    return error;
  }
};


const deleteMessage = async(id) => {
  try{
    const deleteMessage = await db.none(
      `DELETE FROM message WHERE id=$1`, id
    )
    return deleteMessage
  }
  catch(error){
    console.log(error)
    return error
  }
}

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


module.exports = { getAllMessages, sendMessage, deleteMessage }