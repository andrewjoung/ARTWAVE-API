var express = require('express');
var router = express.Router();
const db = require("../models");

router.get('/book/:id', (req, res) => {
    db.Book.findOne({_id: req.params.id}).then(bookData => {
        console.log(bookData);
        res.json(bookData);
    }).catch(err => {
        console.log(err);
        res.end();
    });
});

module.exports = router;