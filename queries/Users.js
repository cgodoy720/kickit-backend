const db = require("../db/dbConfig");

const getAllUsers = async () => {
  try {
    const allUsers = await db.manyOrNone(`
      SELECT users.*, to_char(age, 'MM/DD/YYYY') AS birthdate, DATE_PART('year', AGE(CURRENT_DATE, age)) AS calculated_age
      FROM users`);

    const updateUsers = allUsers.map(user => ({
      ...user,
      age: {
        DOB: user.birthdate,
        age: user.calculated_age
      },
      calculated_age: undefined,
      birthdate: undefined
    }));

    return updateUsers;
  } catch (error) {
    console.log(error);
    return error;
  }
};



const getUser = async (username) => {
  try {
    const oneUser = await db.one(
      `
      SELECT users.*, to_char(age, 'MM/DD/YYYY') AS birthdate, DATE_PART('year', AGE(CURRENT_DATE, age)) AS calculated_age
      FROM users
      WHERE username = $1
      `,
      username
    );

    const updatedUser = {
      ...oneUser,
      age: {
        DOB: oneUser.birthdate,
        age: oneUser.calculated_age
      },
      calculated_age: undefined,
      birthdate: undefined
    };

    return updatedUser;
  } catch (error) {
    console.log(error);
    return error;
  }
};


const createUser = async (user) => {
  try {
   
    const newUser = await db.one(
      "INSERT INTO users (first_name, last_name, age, username, email, firebase_id, pronouns, bio, profile_img) VALUES ($1, $2, $3, $4, $5, $6 , $7, $8, $9) RETURNING *",
      [
        user.first_name,
        user.last_name,
        user.age,
        user.username,
        user.email,
        user.firebase_id,
        user.pronouns,
        user.bio,
        user.profile_img
      ]
    );

    return newUser;
  } catch (error) {
    console.log(error)
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
      "UPDATE users SET first_name=$1, last_name=$2, username=$3, email=$4 , pronouns=$5, bio=$6, profile_img=$7 WHERE id=$8 RETURNING *",
      [
        user.first_name,
        user.last_name,
        user.username,
        user.email,
        user.pronouns,
        user.bio,
        user.profile_img,
        id
      ]
    );
    return updatedUser;
  } catch (error) {

    return error;
  }
};



const getUserByFirebaseId = async (firebase_id) => {
   try {
    const oneUser = await db.one(
      `
      SELECT users.*, to_char(age, 'MM/DD/YYYY') AS birthdate, DATE_PART('year', AGE(CURRENT_DATE, age)) AS calculated_age
      FROM users
      WHERE firebase_id = $1
      `,
      firebase_id
    );

    const updatedUser = {
      ...oneUser,
      age: {
        DOB: oneUser.birthdate,
        age: oneUser.calculated_age
      },
      calculated_age: undefined,
      birthdate: undefined
    };

    return updatedUser;
  } catch (error) {
    console.log(error);
    return error;
  }
};


const getAllEventsForUsers = async (id) => {

try{
  const eventsByUser = await db.any(
    `SELECT event_id, users_id, title, location_image, selected, added, rsvp, interested, to_char(date_event, 'MM/DD/YYYY') AS date_event
    FROM users_events
    JOIN users ON users.id = users_events.users_id 
    JOIN events ON events.id = users_events.event_id
    WHERE users_events.users_id = $1`, id
  )
  return eventsByUser
}
catch(error){
  console.log(error)
  return error
}

}

const getUserEventById = async (userId , eventId) => {
  try{
    const eventsByUser = await db.one(
      `SELECT event_id, users_id, title, location_image, selected, added, rsvp, interested, to_char(date_event, 'MM/DD/YYYY') AS date_event
      FROM users_events
      JOIN users ON users.id = users_events.users_id 
      JOIN events ON events.id = users_events.event_id
      WHERE users_events.users_id = $1 AND users_events.event_id =$2`, 
      [userId , eventId]
    )
    return eventsByUser
  }
  catch(error){
    console.log(error)
    return error
  }
}


const addEventsToUser = async (userId, eventId) => {
  try{
    const add = await db.none(
      `INSERT INTO users_events (users_id, event_id, selected, interested, rsvp, added) VALUES($1, $2, $3, $4, $5, $6)`,
      [userId, eventId, false, false, false, true]
    )
    return !add
  }
  catch(error){
    return error
  }
}

const deleteEventFromUsers = async (userId , eventId) => {
  try{
      const deleteEvent = await db.one(
          'DELETE FROM users_events WHERE users_id = $1 AND event_id = $2 RETURNING *', 
          [userId, eventId]
      )
      return deleteEvent
  }
  catch(error){
      return error
  }
}

const updateEventsForUsers = async(user, userId, eventId) => {
  try{
    const update = await db.one(
      `UPDATE users_events SET selected=$1, rsvp=$2, interested=$3 WHERE users_id=$4 AND event_id=$5 RETURNING *`,
      [user.selected, user.rsvp, user.interested, userId, eventId]
    )
    return update
  }
  catch(error){
    console.log(error)
    return error
  }
}


const getCategoryFromUsers = async (id) => {
  try {
    const getCategory = await db.any(
      `SELECT users_categories.users_id, users_categories.added, users_categories.category_id, categories.name FROM users_categories JOIN categories ON categories.id = users_categories.category_id JOIN users ON users.id = users_categories.users_id WHERE users.id = $1`,
      [id]
    );
    return getCategory;
  } catch (error) {

    return error;
  }
};

const getCategoryFromUserByIndex = async(userId, categoryId) => {
  try{
    const getCategory = await db.one(
      `SELECT users_categories.users_id, added, users_categories.category_id, categories.name
      FROM users_categories
      JOIN categories ON categories.id = users_categories.category_id
      JOIN users ON users.id = users_categories.users_id
      WHERE users.id = $1 AND category_id =$2`,
       [userId , categoryId])
       return getCategory
  }

  catch(error){
    console.log(error)
  }
}


const addCategoryToUser = async (userId, categoryId) => {
  try{
    const add = await db.none(
      `INSERT INTO users_categories (users_id, category_id, added) VALUES($1 , $2, $3)`,
      [userId , categoryId, true]
    )
    return !add
  }
  catch(error){

    return error
  }
}


const deleteCategoryFromUsers = async (userId, categoryId) => {
  try{
    const deletes = await db.one(
      `DELETE FROM users_categories WHERE users_id = $1 AND category_id =$2 RETURNING *`,
      [userId , categoryId]
    )
    return deletes
  }
  catch(error){

    return error
  }
}

const getUserAttendingSameEvent = async (eventId) => {
  try {
    const attending = await db.any(
      `SELECT username, profile_img, rsvp, interested
      FROM users 
      JOIN users_events ON users.id = users_events.users_id
      WHERE users_events.event_id = $1`,
      eventId
    );
    return attending;
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
  getCategoryFromUsers,
  deleteEventFromUsers,
  addCategoryToUser,
  addEventsToUser,
  getAllEventsForUsers,
  deleteCategoryFromUsers,
  updateEventsForUsers,
  getUserEventById,
  getCategoryFromUserByIndex,
  getUserAttendingSameEvent
};
