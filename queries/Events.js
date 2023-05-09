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
    try{
        const oneEvent = await db.one(`
        SELECT events.*, array_agg(json_build_object('id', categories.id, 'name', categories.name)) AS category_names
      FROM events
      JOIN events_categories ON events.id = events_categories.event_id
      JOIN categories ON categories.id = events_categories.category_id
        WHERE events.id=$1
        GROUP BY events.id  HAVING count(*) > 1 OR count(events_categories.event_id) = 1;`, id)
        return oneEvent
    }
    catch(error){
        return error
    }
}


const createEvent = async (event, categoryIds) => {
    try {

       //Grabbing all the categories from the category table that matches with the categoryIds parameter  
      const categoryNames = await db.manyOrNone(
        `SELECT name , id FROM categories WHERE id = ANY($1)`,
        [categoryIds]
      );
      
      const newEvent = await db.one(
        `INSERT INTO events (title, date_created, date_event, category, summary, max_people, age_restriction, age_min, age_max, location, creator_id)
         VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING *`,
        [
          event.title,
          event.date_created,
          event.date_event,
          categoryIds,
          event.summary,
          event.max_people,
          event.age_restriction,
          event.age_min,
          event.age_max,
          event.location,
          event.creator_id,
        ]
      );
      
      const eventCategoryValues = categoryIds.map((categoryId) => `(${newEvent.id}, ${categoryId})`).join(',');
      await db.none(`INSERT INTO events_categories (event_id, category_id) VALUES ${eventCategoryValues}`);

      //insert a new colum call category_names that store the array of category names 
      newEvent.category_names = categoryNames.map((category) => ({ id: category.id, name: category.name }));
      
      return newEvent;
    } catch (error) {
      return error;
    }
  };
  


const deleteCategoryFromEvent = async (categoryId, eventId) => {
  try{
    const deleteCategory = await db.result(
      'DELETE FROM events_categories WHERE category_id = $1 AND event_id=$2 RETURNING *,'
      [categoryId , eventId]
    )
    return deleteCategory.rowCount
  }
  catch(error){
    return error
  }
}


const addCategory = async(categoryIds , eventId) => {
  try{

     await db.one(
      'INSERT INTO events_categories (category_id, event_id) values($1 , $2)',
      [categoryIds , eventId]
    )

    const updateEvent = await getEvents(eventId)
    return updateEvent
  }
  catch(error){
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


module.exports = {deleteEvent , createEvent, getAllEvents, getEvent, addCategory, deleteCategoryFromEvent}
