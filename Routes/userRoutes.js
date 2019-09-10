var express = require('express');
var router = express.Router();
const db = require("../models");

// These two get routes look like duplicates - one from GetFriends.js, the other from getFriendData.js

//
router.get('/friends/:id', (req, res) => {
    console.log(req.params.id);
    db.User.findOne({ _id: req.params.id }).populate("friends").then(dbRes => {
        console.log("Friend Data: ", dbRes);
        res.json(dbRes);
    }).catch(err => {
        console.log(err);
        res.end();
    });
});

//
router.get("/getFriends/:id", (req, res) => {
    // use populate to get all friends
    db.User.findOne({ _id: req.params.id }).populate("friends").then(dbRes => {
        console.log("User friends: \n", dbRes);
        res.json(dbRes);
    }).catch(err => {
        console.log(err);
        res.end();
    });
});

//
router.get("/user/:id", function (req, res) {
    console.log("testing display list stuff", req.params.id);
    db.User.findOne({ username: req.params.id }).populate("lists").then(function (dbUser) {
        console.log(dbUser)
        res.json(dbUser);
    }).catch(function (err) {
        res.json(err);
    });
});

//
router.get('/recommended/data/:id', (req, res) => {
    const userId = req.params.id;
    db.User.findOne({ _id: userId }).populate("recommended").then(dbRes => {
        console.log(dbRes);
        res.json(dbRes);
    }).catch(err => {
        console.log(err);
        res.end()
    });
});

// Get all users except for the currently logged in user
router.get("/users/:id", (req, res) => {
    const id = req.params.id;
    console.log(id);
    db.User.find({}).then(users => {
        const friends = users.filter(user => {
            if (user._id === req.params.id) {
                return false;
            }
            return true;
        });
        console.log(friends);
        res.json(friends);
    }).catch(err => {
        console.log(err);
        res.end();
    });
});

// TODO: should be a GET method
router.post("/seefriend/:username", (req, res) => {
    const { username } = req.params
    db.User.findOne({ username }).then(data => {
        console.log(data)
    })
});

// Recommend a list to a friend
router.post('/recommend', (req, res) => {
    const {friendId, listId} = req.body;

    db.User.updateOne({_id: friendId}, {$push: {recommended: listId}}, {new: true}).then(dbRes => {
        console.log("List added to friend recommended list: \n", dbRes);
        res.end();
    }).catch(err => {
        console.log(err);
    });
});

//
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

router.put("/updatePhoto", (req, res) => {
    const { userId, profileImageUrl } = req.body;
    db.User.updateOne({ _id: userId}, { $set: { profileImage: profileImageUrl } }).then(dbRes => {
        console.log(dbRes);
        res.end();
    }).catch(err => {
        console.log(err);
        res.end();
    });
});

module.exports = router;
