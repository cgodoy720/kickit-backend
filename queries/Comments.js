const db = require("../db/dbConfig")



const getAllComments = async (event_id) => {
    try{
       const allComments = await db.any(
           "SELECT *, to_char(time, 'MM/DD/YYYY') AS time FROM comments WHERE events_id = $1",
           event_id
       ) 
       return allComments
    }
    catch(error){
        return error
    }
}

const getComment = async (id) => {
    try{
        const getComment = await db.one("SELECT *, to_char(time, 'MM/DD/YYYY') AS time FROM comments WHERE id=$1", id)
        return getComment
    }
    catch(error){
        return error
    }
}

const createComment = async (comm) => {
    try{
        
        const addComment = await db.one(
            'INSERT INTO comments (comment, events_id, user_id) VALUES($1, $2, $3) RETURNING *',
            [comm.comment, comm.events_id, comm.user_id]
        )
        return addComment

    }
    catch(error){
        return error
    }
}

const deleteComment = async (id) => {
    try{
        const deleteComment = await db.one(
            'DELETE FROM comments WHERE id = $1 RETURNING *', id
        )
        return deleteComment
    }
    catch(error){
        return error
    }
}


const updateComment = async (id , comment) => {

try{
    const updateComment = await db.one(
        'UPDATE comments SET comment=$1 WHERE id = $2 RETURNING *',
        [comment.comment, id]
    )
    return updateComment
}
catch(error){
    return error
}

}

module.exports={getAllComments, getComment, createComment, deleteComment, updateComment}