var express = require('express');
var router = express.Router();
const db = require("../models");

router.get('/list/:category/:id', (req, res) => {
    console.log(req.params.id);
    const category = req.params.category;
    let itemCategory = "";
    if (category === "cinema") {
        itemCategory = "movie";
    } else if (category === "literature") {
        itemCategory = "book";
    } else {
        itemCategory = "music";
    }

    db.List.findOne({_id: req.params.id}).populate("items." + itemCategory).populate("comments").then(data => {
        console.log("\nSingular List Data: \n", data, "\n");
        data.populate("items");
        res.json(data);
    }).catch(err => {
        console.log(err);
        res.end()
    });
});

module.exports = router;