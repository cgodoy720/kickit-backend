const express = require("express");
const users = express.Router({mergeParams: true});
const {
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
  getCategoryFromUserByIndex
} = require("../queries/Users");

const {checkAge} = require("../middleware/usersValidation")

users.get("/", async (req, res) => {
  const allUsers = await getAllUsers();

    if (allUsers[0]) {
  
        res.status(200).json(allUsers);
    } else {
        res.status(500).json({ error: "server error!"});
    }
});


users.get("/:username", async (req, res) => {

  const {username} = req.params

  const getUsers = await getUser(username)

  if(!getUsers.message){

    res.json(getUsers)
  }
  else{
    res.status(500).json({ error: "User not found!"});
  }
});

users.get("/firebase/:id", async (req, res) => {
  try {
    const user = await getUserByFirebaseId(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

users.post("/", checkAge ,async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

users.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUser(id);
    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(404).json({ error: "id not found" });
  }
});

users.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await updateUser(id, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(404).json({ error: "user not found" });
  }
});

//Add Categories to User
users.post("/:userId/category/:categoryId", async (req , res) => {
  const {userId , categoryId} = req.params

  const addCategory = await addCategoryToUser(userId , categoryId)

  if(addCategory){
    res.json({message: "Category Added"});
  } else {
    res.json({error: "Category not added"})
  }
  
})


//Get Categories for User 
users.get("/:userId/category", async (req , res) => {
  const {userId} = req.params

const userCategory = await getCategoryFromUsers(userId)
res.json(userCategory)

})

//Delete Categories for User 
users.delete("/:userId/category/:categoryId", async (req , res) => {

  const {userId , categoryId} = req.params

  const deleteCategory = await deleteCategoryFromUsers(userId , categoryId)

  if(deleteCategory){
    res.status(200).json(deleteCategory)
  }
})


//Add Event to User 
users.post("/:userId/events/:eventId", async (req , res) => {
  const {userId , eventId} = req.params
  

  const addEvent = await addEventsToUser(userId, eventId)

  if(addEvent){
    res.json({message: "Event Added"});
  } else {
    res.json({error: "Event not added"})
  }

})

//Get Category From Events
users.get("/:userId/events", async(req , res) => {
  const {userId} = req.params;

  const userEvents = await getAllEventsForUsers(userId)
  res.json(userEvents)
})


users.delete("/:userId/events/:eventId", async (req , res) => {
  
const {userId , eventId} = req.params;

const deleteEvent = await deleteEventFromUsers(userId , eventId)

if(deleteEvent){
  res.status(200).json(deleteEvent)
}

})


users.put("/:userId/events/:eventId", async (req , res) => {
  const {userId , eventId} = req.params

  const updateEvent = await updateEventsForUsers(req.body, userId, eventId)

  res.json(updateEvent)

})

users.get("/:userId/events/:eventId", async (req , res) => {
  const {userId , eventId} = req.params

  const userEvent = await getUserEventById(userId , eventId)

  if(!userEvent.message){
    res.json(userEvent)
  }
  else{
    res.status(404).json({error: "not found"})
  }
})


users.get("/:userId/category/:categoryId", async (req , res) => {
  const {userId , categoryId} = req.params

  const getCategory = await getCategoryFromUserByIndex(userId , categoryId)

  if(!getCategory.message){
    res.json(getCategory)
  }
  else{
    res.status(404).json({error: "not found"})
  }
})

module.exports = users;
