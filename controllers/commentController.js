const express = require("express")

const {getAllComments, getComment, createComment, deleteComment, updateComment} = require("../queries/Comments")

const comm = express.Router({mergeParams: true})



comm.get("/", async (req , res) => {
    
const {eventId} = req.params

try{
    const allComments = await getAllComments(eventId);
    res.json(allComments)
}
catch(error){
    res.json(error)
}

})


comm.get("/:id", async (req , res) => {
    const {id} = req.params

    const comm = await getComment(id)

    if(!comm.message){
        res.json(comm)
    }
    else{
        res.status(404).json({error: "not found"})
    }
})


comm.post("/", async (req , res) => {

    try{
        const comm = await createComment(req.body)
        res.json(comm)
    }
    catch(error){
        res.status(400).json({ error: error });
    }

})

comm.delete("/:id", async (req , res) => {
    const {id} = req.params
    const deleteComm = await deleteComment(id)
    if(deleteComm.id){
        res.status(200).json(deleteComm)
    }
    else{
        res.status(404).json("Comment not found")
    }
})


comm.put("/:id", async (req , res) => {
    const {id} = req.params;

    const updateComm = await updateComment(id, req.body);

    res.status(200).json(updateComm);
})

module.exports = comm