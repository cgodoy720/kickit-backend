const express = require("express");
const categories = express.Router();

const { getAllCategories } = require("../queries/Categories");

//! GET ALL CATEGORIES
categories.get("/", async (req, res) => {
    const allCategories = await getAllCategories();
    if (allCategories[0]) {
        res.status(200).json(allCategories);
    } else {
        res.status(500).json({ error: "server error!"});
    }
});


module.exports = categories