var express = require('express');
var router = express.Router();
const db = require("../models");

router.post('/recommend', (req, res) => {
    const {friendId, listId} = req.body;

    db.User.updateOne({_id: friendId}, {$push: {recommended: listId}}, {new: true}).then(dbRes => {
        console.log("List added to friend recommended list: \n", dbRes);
        res.end();
    }).catch(err => {
        console.log(err);
    });
});

module.exports = router;