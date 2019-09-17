var express = require('express');
var router = express.Router();
const db = require("../models");

//
router.post("/create-list", function (req, res) {
    // console.log(req.body);
    db.List.create({ title: req.body.title, category: req.body.category, pinned: req.body.pinned }).then(function (dbList) {
        res.json(dbList);
        return db.User.findOneAndUpdate({ username: req.body.username }, { $push: { lists: dbList._id } }, { new: true });
    }).then(function (dbUser) {
        //res.json(dbUser);
        // console.log(dbUser);
    }).catch(function (err) {
        res.json(err);
    });
});

// The two routes immediately below are doing nearly the same function - should be refactored in the frontend code to use just one

//
router.get('/list/:category/:id', (req, res) => {
    // console.log(req.params.id);
    const category = req.params.category;
    let itemCategory = "";
    if (category === "cinema") {
        itemCategory = "movie";
    } else if (category === "literature") {
        itemCategory = "book";
    } else {
        itemCategory = "music";
    }

    db.List.findOne({ _id: req.params.id }).populate("items." + itemCategory).populate({path: "comments", options: {sort: {createdAt: 1}}}).then(data => {
        data.populate("items");
        console.log("\nSingular List Data: \n", data, "\n");
        res.json(data);
    }).catch(err => {
        console.log(err);
        res.end()
    });
});

//
router.post('/list/:id/:category', (req, res) => {
    db.List.findOne({ _id: req.params.id }).populate("items").then(data => {
        // console.log("\nSingular List Data: ", data, "\n");
        res.json(data);
    }).catch(err => {
        console.log(err);
        res.end()
    });
});

module.exports = router;