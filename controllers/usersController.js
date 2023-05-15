const express = require("express");
const users = express.Router();
const {
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
} = require("../queries/Users");

users.get("/", async (req, res) => {
  const allUsers = await getAllUsers();
  if (allUsers[0]) {
    res.status(200).json(allUsers);
  } else {
    res.status(500).json({ error: "server error" });
  }
});

users.get("/:id", async (req, res) => {
  try {
    const user = await getUser(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error });
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

users.post("/", async (req, res) => {
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

//Add Categories/Interests to Users
users.post("/:userId/categories", async (req , res) => {
  const {userId} = req.params
  const {categoryId} = req.body

  try{
    const users = await addCategoryToUser (userId , categoryId)
    res.status(200).json(users)
  }
  catch(error){
    res.status(500).json({ error: "Server error!" });
  }

})


//Delete Category From Users 
users.delete("/:userId/categories/:categoriesId", async (req , res) => {
  const {userId, categoriesId} = req.params

  const deleteCategory = await deleteCategoryFromUsers(userId, categoriesId)
  if(deleteCategory > 0){
    res.status(200).json({ success: true });
  }
  else{
    res.status(404).json({ error: "User category not found!" });
  }
})

//Add Event to User 
users.post("/:userId/events/:eventId", async (req , res) => {
  const {userId , eventId} = req.params
  const {selected} = req.body

  const addEvent = await addEventsToUser(userId, eventId, selected)

  if(addEvent){
    res.json({message: "Event Added"});
  } else {
    res.json({error: "Event not added"})
  }

})


users.get("/:userId/events", async(req , res) => {
  const {userId} = req.params;

  const userEvents = await getAllEventsForUsers(userId)
  res.json(userEvents)
})


users.delete("/:userId/event/:eventId", async (req , res) => {
  
const {userId , eventId} = req.params;

const deleteEvent = await deleteEventFromUsers(userId , eventId)

if(deleteEvent){
  res.status(200).json(deleteEvent)
}

})

module.exports = users;
