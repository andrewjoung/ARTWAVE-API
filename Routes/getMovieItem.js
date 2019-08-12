var express = require('express');
var router = express.Router();
const db = require("../models");

router.get('/movie/:id', (req, res) => {
    db.Movie.findOne({_id: req.params.id}).then(movieData => {
        console.log(movieData);
        res.json(movieData);
    }).catch(err => {
        console.log(err);
        res.end();
    });
});

module.exports = router;