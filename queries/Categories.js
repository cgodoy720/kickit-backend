const db = require("../db/dbConfig")

const getAllCategories = async () => {
    try{
        const allCategories = await db.any('SELECT * FROM categories')
        return allCategories
    }
    catch(error){
        return error
    }
}

module.exports={getAllCategories}