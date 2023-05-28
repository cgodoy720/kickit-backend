const express = require("express");


const friends = express.Router()

const {sendFriendRequest , acceptFriendRequest , deleteFriendRequest, getFriendsList, getFriendRequests } = require("../queries/Friends")


friends.post("/", async (req, res) => {
    try {
      const request = await sendFriendRequest(req.body);
      res.json(request);
    } catch (error) {
      console.log(error)
      res.status(400).json({ error: error.message });
    }
  });
  
  friends.post("/:userId/accept/:senderId", async (req, res) => {
    const { userId, senderId } = req.params;
    try {
      const accept = await acceptFriendRequest(userId, senderId);
      res.json(accept);
    } catch (error) {
      console.log(error);
      res.status(404).json("Can't Accept Request")
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