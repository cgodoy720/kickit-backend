const db = require("../db/dbConfig");

const getAllUsers = async () => {
  try {
    const allUsers = await db.any("SELECT * FROM users");
    return allUsers;
  } catch (error) {
    return error;
  }
};

const getUser = async (id) => {
  try {
    const oneUser = await db.one("SELECT * FROM users WHERE id=$1", id);
    return oneUser;
  } catch (error) {
    return error;
  }
};

const createUser = async (user) => {
  try {
    const newUser = await db.one(
      "INSERT INTO users (first_name, last_name, age, pronouns, bio, username, email, profile_img, firebase_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        user.first_name,
        user.last_name,
        user.age,
        user.pronouns,
        user.bio,
        user.username,
        user.email,
        user.profile_img,
        user.firebase_id,
      ]
    );
    return newUser;
  } catch (error) {
    return error;
  }
};

const deleteUser = async (id) => {
  try {
    const deletedUser = await db.one(
      "DELETE FROM users WHERE id=$1 RETURNING *",
      id
    );
    return deletedUser;
  } catch (error) {
    return error;
  }
};

const updateUser = async (id, user) => {
  try {
    const updatedUser = await db.one(
      "UPDATE users SET first_name=$1, last_name=$2, age=$3, pronouns=$4, bio=$5, username=$6, email=$7, profile_img=$8, firebase_id=$9 WHERE id=$10 RETURNING *",
      [
        user.first_name,
        user.last_name,
        user.age,
        user.pronouns,
        user.bio,
        user.username,
        user.email,
        user.profile_img,
        user.firebase_id,
        id,
      ]
    );
    return updatedUser;
  } catch (error) {
    return error;
  }
};

const getUserByFirebaseId = async (firebase_id) => {
  try {
    const user = await db.one(
      "SELECT * FROM users WHERE firebase_id=$1",
      firebase_id
    );
    return user;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
  getUserByFirebaseId,
};
