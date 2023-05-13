const db = require("../db/dbConfig")

const getAllEvents = async () => {
  try {
    const allEvents = await db.manyOrNone(`
      SELECT events.*, 
      array_agg(json_build_object('id', categories.id, 'name', categories.name)) AS category_names,
      array_agg(json_build_object('id', users.id, 'username', users.username)) AS creator,
      to_char(start_time, 'HH:MI AM') AS start_time, 
      to_char(end_time, 'HH:MI AM') AS end_time,
      to_char(date_created, 'MM/DD/YYYY') AS date_created, 
      to_char(date_event, 'MM/DD/YYYY') AS date_event
      FROM events
      JOIN events_categories ON events.id = events_categories.event_id
      JOIN categories ON categories.id = events_categories.category_id
      JOIN users ON users.id = events.creator_id 
      GROUP BY events.id
      HAVING count(*) > 1 OR count(events_categories.event_id) = 1;
    `);
    return allEvents;
  } catch (error) {
    console.log(error)
    return error;
  }
};



const getEvent = async (id) => {
  try {
    const oneEvent = await db.one(
      `
      SELECT events.*, 
      array_agg(json_build_object('id', categories.id, 'name', categories.name)) AS category_names,
      array_agg(json_build_object('id', users.id, 'username', users.username)) AS creator,
      to_char(start_time, 'HH:MI AM') AS start_time, 
      to_char(end_time, 'HH:MI AM') AS end_time,
      to_char(date_created, 'MM/DD/YYYY') AS date_created, 
      to_char(date_event, 'MM/DD/YYYY') AS date_event
      FROM events
      JOIN events_categories ON events.id = events_categories.event_id
      JOIN categories ON categories.id = events_categories.category_id
      JOIN users ON users.id = events.creator_id 
      WHERE events.id = $1
      GROUP BY events.id HAVING count(*) > 1 OR count(events_categories.event_id) = 1;
      `,
      id
    );
    return oneEvent;
  } catch (error) {
    return error;
  }
};


const createEvent = async (event, categoryNames, creatorUsernames) => {
  try {
    // Retrieve category IDs
    const categoryIds = await db.manyOrNone(
      `SELECT id FROM categories WHERE name = ANY($1)`,
      [categoryNames]
    );

    // Retrieve creator IDs based on usernames
    const creatorIds = await db.manyOrNone(
      `SELECT id FROM users WHERE username = ANY($1)`,
      [creatorUsernames]
    );

    // Insert new event into events table
    const newEvent = await db.one(
      `INSERT INTO events (title, date_event, summary,
         max_people, age_restriction, age_min, age_max, location, address, start_time, end_time, location_image, creator_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [
        event.title,
        event.date_event,
        event.summary,
        event.max_people,
        event.age_restriction,
        event.age_min,
        event.age_max,
        event.location,
        event.address,
        event.start_time,
        event.end_time,
        event.location_image,
        event.creator_id, // Assuming there is only one creator
      ]
    );

    // Insert event-category relationships into events_categories table
    const eventCategoryValues = categoryIds
      .map((categoryId) => `(${newEvent.id}, ${categoryId.id})`)
      .join(',');
    await db.none(
      `INSERT INTO events_categories (event_id, category_id) VALUES ${eventCategoryValues}`
    );

    // Add category_names and creator arrays to the new event object
    newEvent.category_names = categoryNames.map((name, index) => ({
      id: categoryIds[index].id,
      name: name,
    }));

    newEvent.creator = creatorIds.map((username, index) => ({
      id: creatorIds[index].id,
      username: username,
    }));

    return newEvent;
  } catch (error) {
    console.log(error);
    return error;
  }
};



const deleteCategoryFromEvent = async (eventId, categoryId) => {
  try{
    const deleteCategory = await db.result(
      'DELETE FROM events_categories WHERE event_id = $1 AND category_id=$2 RETURNING *',
      [eventId, categoryId]
    )
    return deleteCategory.rowCount
  }
  catch(error){
    return error
  }
}


const addCategory = async(eventId , categoryIds) => {
  try{
     await db.none(
      'INSERT INTO events_categories (event_id, category_id) SELECT $1, unnest($2::int[])',
      [eventId , categoryIds]
    )

    const updateEvent = await getEvent(eventId)
    return updateEvent
  }
  catch(error){
    console.log(error)
    return error
  }
}



const deleteEvent = async (id) => {
    try{
        const deletedEvents = await db.one(
            'DELETE FROM events WHERE id = $1 RETURNING *', id
        )
        return deletedEvents
    }
    catch(error){
        return error
    }
}



const updateEvent = async(id , event) => {

  try{
  
  const updatedEvent = await db.one(
    `
    UPDATE events SET title=$1, date_event=$2, summary=$3, max_people=$4, age_restriction=$5, 
    age_min=$6, age_max=$7, location=$8, 
    address=$9, start_time=$10, end_time=$11, location_image=12 WHERE id=$13 RETURNING *`,

    [event.title , event.date_event, event.summary, event.max_people, event.age_restriction
    ,event.age_min, event.age_max, event.location, 
    event.address, event.start_time, event.end_time, event.location_image, id ]
  );
  return updatedEvent
  }
  catch(error){
    return error
  }
  
  }


module.exports = {deleteEvent , createEvent, getAllEvents, getEvent, addCategory, deleteCategoryFromEvent, updateEvent}
