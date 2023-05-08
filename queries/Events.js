const db = require("../db/dbConfig")

const getAllEvents = async () => {
    try {
      const allEvents = await db.manyOrNone(`
        SELECT events.*, array_agg(categories.name) AS category_names
        FROM events
        LEFT JOIN categories ON categories.id = ANY (events.category)
        GROUP BY events.id
      `);
      return allEvents;
    } catch (error) {
      return error;
    }
  };

const getEvent = async (id) => {
    try{
        const oneEvent = await db.one(`
        SELECT events.*, array_agg(categories.name) AS category_names
        FROM events
        LEFT JOIN categories ON categories.id = ANY (events.category)
        WHERE events.id=$1
        GROUP BY events.id`, id)
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
        `SELECT name FROM categories WHERE id = ANY($1)`,
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
      
      //insert a new colum call category_names that store the array of category names 
      newEvent.category_names = categoryNames.map((category) => category.name);
      
      return newEvent;
    } catch (error) {
      return error;
    }
  };
  


const deleteEvent = async (id) => {
    try{
        const deletedEvents = await db.one(
            'DELETE FROM event WHERE id = $1 RETURNING *', id
        )
        return deletedEvents
    }
    catch(error){
        return error
    }
}

module.exports = {deleteEvent , createEvent, getAllEvents, getEvent}