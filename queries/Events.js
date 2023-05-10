const db = require("../db/dbConfig")

const getAllEvents = async () => {
    try {
      const allEvents = await db.manyOrNone(`
      SELECT events.*, array_agg(json_build_object('id', categories.id, 'name', categories.name)) AS category_names
      FROM events
      JOIN events_categories ON events.id = events_categories.event_id
      JOIN categories ON categories.id = events_categories.category_id
      GROUP BY events.id
      HAVING count(*) > 1 OR count(events_categories.event_id) = 1;
      `);
      return allEvents;
    } catch (error) {
      return error;
    }
  };


const getEvent = async (id) => {
  try {
    const oneEvent = await db.one(
      `
      SELECT events.*, array_agg(json_build_object('id', categories.id, 'name', categories.name)) AS category_names
      FROM events
      JOIN events_categories ON events.id = events_categories.event_id
      JOIN categories ON categories.id = events_categories.category_id
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


const createEvent = async (event, categoryIds) => {
  try {
    const categoryNames = await db.manyOrNone(
      `SELECT name, id FROM categories WHERE id = ANY($1)`,
      [categoryIds]
    );

    const newEvent = await db.one(
      `INSERT INTO events (title, date_created, date_event, summary, max_people, age_restriction, age_min, age_max, location, creator_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        event.title,
        event.date_created,
        event.date_event,
        event.summary,
        event.max_people,
        event.age_restriction,
        event.age_min,
        event.age_max,
        event.location,
        event.creator_id,
      ]
    );

    const eventCategoryValues = categoryIds
      .map((categoryId) => `(${newEvent.id}, ${categoryId})`)
      .join(',');
    await db.none(
      `INSERT INTO events_categories (event_id, category_id) VALUES ${eventCategoryValues}`
    );

    newEvent.category_names = categoryNames.map((category) => ({
      id: category.id,
      name: category.name,
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
  
  const updateEvent = await db.one(
    'UPDATE events SET title=$1, date_event=$2, summary=$3, max_people=$4, age_restriction=$5, age_min=$6, age_max=$7, location=$8 WHERE id=$9',
    [event.title , event.date_event, event.summary, event.max_people, event.age_restriction, event.age_min, event.age_max, event.location, id ]
  )
  
  return updateEvent
  
  }
  catch(error){
    return error
  }
  
  }


module.exports = {deleteEvent , createEvent, getAllEvents, getEvent, addCategory, deleteCategoryFromEvent, updateEvent}
