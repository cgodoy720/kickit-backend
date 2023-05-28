const db = require("../db/dbConfig");

const sendFriendRequest = async (request) => {
  try {
    const getUserId = await db.one(
      `SELECT * FROM users_friends WHERE users_id = $1`,
      [request.users_id]
    );

    if (getUserId) {
      return { error: 'Duplicate friend request.' };
    } else {
      const sendRequest = await db.none(
        `
        INSERT INTO users_friends (users_id, senders_id, message)
        VALUES ($1, $2, $3);
      `,
        [request.users_id, request.senders_id, request.message]
      );
      return sendRequest;
    }
  } catch (error) {
    throw error;
  }
};
  
  
  const acceptFriendRequest = async (accept) => {
    try {
      await db.task(async (t) => {
        await t.none(`
          DELETE FROM users_friends
          WHERE users_id = $1 AND senders_id = $2;
        `, [accept.users_id, accept.senders_id]);
  
        await t.none(`
          INSERT INTO users_friends (users_id, senders_id)
          VALUES ($1, $2);
        `, [accept.users_id, accept.senders_id]);
      });
    } catch (error) {
      throw error;
    }
  };
  
  const deleteFriendRequest = async (userId, senderId) => {
    try {
      await db.none(`
        DELETE FROM users_friends
        WHERE users_id = $1 AND senders_id = $2;
      `, [userId, senderId]);
    } catch (error) {
      throw error;
    }
  };
  
  const getFriendsList = async (userId) => {
    try{
      return await db.any(`
        SELECT u.id, u.first_name, u.last_name
        FROM users u
        INNER JOIN users_friends uf ON u.id = uf.users_id
        WHERE uf.senders_id = $1;
      `, [userId]);
    }
    catch(error){
      return error
    }
  }
  
  const getFriendRequests = async (userId) => {
    try {
      return await db.any(`
        SELECT u.id, u.first_name, u.last_name, uf.message
        FROM users u
        INNER JOIN users_friends uf ON u.id = uf.senders_id
        WHERE uf.users_id = $1;
      `, [userId]);
    } catch (error) {
      throw error;
    }
  };

  module.exports={sendFriendRequest , acceptFriendRequest , deleteFriendRequest, getFriendsList, getFriendRequests }