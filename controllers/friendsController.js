const express = require("express");

const friends = express.Router()

const {sendFriendRequest , acceptFriendRequest , deleteFriendRequest, getFriendsList, getFriendRequests } = require("../queries/Friends")




module.exports = friends