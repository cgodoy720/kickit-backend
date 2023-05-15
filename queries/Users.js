const db = require("../db/dbConfig");

const getAllUsers = async () => {
  try {
    const allUsers = await db.any(`SELECT users.*, 
    array_agg(json_build_object('id', categories.id, 'name', categories.name)) AS category_names 
    FROM users
    JOIN users_categories ON users.id = users_categories.users_id
    JOIN categories ON categories.id = users_categories.event_id
    GROUP BY users.id
    HAVING count(*) > 1 OR COUNT(users_categories.users_id) = 1
    `);
    return allUsers;
  } catch (error) {
    return error;
  }
};

const getUser = async (id) => {
  try {
    const oneUser = await db.one(`SELECT users.*, 
    array_agg(json_build_object('id', categories.id, 'name', categories.name)) AS category_names 
    FROM users
    JOIN users_categories ON users.id = users_categories.users_id
    JOIN categories ON categories.id = users_categories.event_id
    WHERE users.id = $1
    GROUP BY users.id
    HAVING count(*) > 1 OR COUNT(users_categories.users_id) = 1
    `, id);
    return oneUser;
  } catch (error) {
    return error;
  }
};

const createUser = async (user, categoryNames) => {
  try {

    const categoryIds = await db.manyOrNone(
      `SELECT id FROM categories WHERE name = ANY($1)`,
      [categoryNames]
    );

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

    const usersCategoryValues = categoryIds
    .map((categoryId) => `(${newUser.id}, ${categoryId.id})`)
    .join(',');
  await db.none(
    `INSERT INTO users_categories (users_id, category_id) VALUES ${usersCategoryValues}`
  );

  newUser.category_names = categoryNames.map((name, index) => ({
    id: categoryIds[index].id,
    name: name,
  }));

    return newUser;
  } catch (error) {
    return error;
  }
};


const deleteCategoryFromUsers = async (userId, categoryId) => {
  try{
    const deleteCategory = await db.result(
      `DELETE FROM users_categories WHERE users_id = $1 AND category_id = $2 RETURNING *`,
      [userId , categoryId]
    )
    return deleteCategory
  }
  catch(error){
    return error
  }
}

const addCategoryToUser = async (userId, categoryId) => {
  try{
    await db.none(
      `INSERT INTO users_categories (users_id , category_id) SELECT $1, unnest($2::int[])`,
      [userId , categoryId]
    )

    const updateUser = await getUser(userId)
    return updateUser
  }
  catch(error){
    return error
  }
}

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
      `SELECT users.*, 
      array_agg(json_build_object('id', categories.id, 'name', categories.name)) AS category_names 
      FROM users
      JOIN users_categories ON users.id = users_categories.users_id
      JOIN categories ON categories.id = users_categories.event_id
      WHERE users.firebase_id  = $1
      GROUP BY users.id
      HAVING count(*) > 1 OR COUNT(users_categories.users_id) = 1
      `, firebase_id
    );
    return user;
  } catch (error) {
    return error;
  }
};


const getAllEventsForUsers = async (id) => {

try{
  const eventsByUser = await db.any(
    `SELECT event_id, users_id, title, location_image, to_char(date_event, 'MM/DD/YYYY') AS date_event
    FROM users_events
    JOIN users ON users.id = users_events.users_id
    JOIN events ON events.id = users_events.event_id
    WHERE users_events.users_id = $1`, id
  )
  return eventsByUser
}
catch(error){
  return error
}

}


const addEventsToUser = async (userId, eventId, selected=false) => {
  try{
    const add = await db.none(
      `INSERT INTO users_events (users_id, event_id, selected) VALUES($1, $2, $3)`,
      [userId, eventId, selected]
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


module.exports = {
  getAllUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
  getUserByFirebaseId,
  deleteCategoryFromUsers,
  deleteEventFromUsers,
  addCategoryToUser,
  addEventsToUser,
  getAllEventsForUsers
};
