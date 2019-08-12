var express = require('express');
var router = express.Router();
const db = require("../models");

router.get('/music/:id', (req, res) => {
    db.Music.findOne({_id: req.params.id}).then(musicData => {
        console.log(musicData);
        res.json(musicData);
    }).catch(err => {
        console.log(err);
        res.end();
    });
});

module.exports = router;