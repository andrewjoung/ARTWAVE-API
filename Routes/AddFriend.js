var express = require('express');
var router = express.Router();
const db = require("../models");


router.put("/addFriend", (req, res) => {
    const { userId, friendId } = req.body;
    db.User.update({ _id: userId }, { $push: { friends: friendId } }).then(dbRes => {
        console.log(dbRes);
        res.json(dbRes);
    }).catch(err => {
        console.log(err);
        res.end();
    });
});

module.exports = router;
