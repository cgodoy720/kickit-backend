const express = require("express");


const friends = express.Router()

const {sendFriendRequest , acceptFriendRequest , deleteFriendRequest, getFriendsList, getFriendRequests } = require("../queries/Friends")


friends.post("/", async (req, res) => {
    try {
      const request = await sendFriendRequest(req.body);
      res.json(request);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  friends.post("/accept", async (req, res) => {
    try {
      const accept = await acceptFriendRequest(req.body);
      res.json(accept);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  

  friends.delete("/:userId/denied/:senderId", async (req , res) => {

    const {userId, senderId} = req.params

    const deleteRequest = await deleteFriendRequest(userId, senderId)

    if(deleteRequest){
        res.status(200).json(deleteRequest)
    }
    else{
        res.status(404).json("Request not found")
    }

  })
  

  friends.get(`/:userId/list`, async (req ,res) => {
      const {userId} = req.params

      const getFriends = await getFriendsList(userId)

      if(!getFriends.message){
          res.json(getFriends)
      }
      else{
        res.status(404).json({error: "not found"})
      }
      
  })


friends.get(`/:userId/request`, async (req ,res) => {

    const {userId} = req.params

    const getRequest = await getFriendRequests(userId)

    if(!getRequest.message){
        res.json(getRequest)
    }
    else{
      res.status(404).json({error: "not found"})
    }

})

module.exports = friends