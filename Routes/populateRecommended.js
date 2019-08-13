var express = require('express');
var router = express.Router();
const db = require("../models");

router.get('/recommended/data/:id', (req, res) => {
    const userId = req.params.id;
    db.User.findOne({_id: userId}).populate("recommended").then(dbRes => {
        console.log(dbRes);
        res.json(dbRes);
    }).catch(err => {
        console.log(err);
        res.end()
    });    
});

module.exports = router;