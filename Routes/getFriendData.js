var express = require('express');
var router = express.Router();
const db = require("../models");

router.get('/friends/:id', (req, res) => {
    console.log(req.params.id);
    db.User.findOne({_id: req.params.id}).populate("friends").then(dbRes => {
        console.log("Friend Data: ", dbRes);
        res.json(dbRes);
    }).catch(err => {
        console.log(err);
        res.end();
    });
});

module.exports = router;