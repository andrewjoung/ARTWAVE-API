var express = require('express');
var router = express.Router();
const db = require("../models");

router.get('/list/:id', (req, res) => {
    console.log(req.params.id);
    db.List.findOne({_id: req.params.id}).populate("items").populate("comments").then(data => {
        console.log("\nSingular List Data: ", data, "\n");
        res.json(data);
    }).catch(err => {
        console.log(err);
        res.end()
    });
});

module.exports = router;