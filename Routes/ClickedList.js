var express = require('express');
var router = express.Router();
const db = require("../models");

// router.post('/list/:id/:category', (req, res) => {
//     var array = []

//     const { id, category } = req.params
//     db.List.findOne({_id: id}).then(data => {
//         let array = []
//         let count = 0

//         if (category === 'cinema') {
//             for (var i = 0; i < data.items.length; i++) {
//                 db.Movie.findOne({ _id: data.items[i] }).then(data2 => {
//                     array.push(data2)
//                     count++

//                     if (count === data.items.length) {
//                         let commentIds = []
//                         commentsArray = []
//                         let count2 = 0
//                         if (data.comments.length !== 0) {
//                             for (var i = 0; i < data.comments.length; i++) {
//                                 commentIds.push(data.comments[i])
//                             }
//                             for (var i = 0; i < commentIds.length; i++) {
//                                 db.Comment.findOne({ _id: commentIds[i] }).then(commentData => {
//                                     commentsArray.push(commentData.body)
//                                     count2++
//                                     if (count2 === commentIds.length) {
//                                         res.send({ array, id, commentsArray })
//                                     }
//                                 })

//                             }

//                         }
//                         else {
//                             let commentsArray = []
//                             res.send({ array, id, commentsArray })
//                         }
//                     }
//                 })

//             }


//         }
//         else if (category === 'literature') {
//             for (var i = 0; i < data.items.length; i++) {
//                 db.Book.findOne({ _id: data.items[i] }).then(data2 => {
//                     array.push(data2)
//                     count++

//                     if (count === data.items.length) {
//                         let commentIds = []
//                         commentsArray = []
//                         let count2 = 0
//                         if (data.comments.length !== 0) {
//                             for (var i = 0; i < data.comments.length; i++) {
//                                 commentIds.push(data.comments[i])
//                             }
//                             for (var i = 0; i < commentIds.length; i++) {
//                                 db.Comment.findOne({ _id: commentIds[i] }).then(commentData => {
//                                     commentsArray.push(commentData.body)
//                                     count2++
//                                     if (count2 === commentIds.length) {
//                                         res.send({ array, id, commentsArray })
//                                     }
//                                 })

//                             }

//                         }
//                         else {
//                             let commentsArray = []
//                             res.send({ array, id, commentsArray })
//                         }
//                     }
//                 })

//             }

//         }
//         else if (category === 'music') {
//             for (var i = 0; i < data.items.length; i++) {
//                 db.Music.findOne({ _id: data.items[i] }).then(data2 => {
//                     array.push(data2);
//                     count++
//                     if (count === data.items.length) {

//                         let commentIds = []
//                         commentsArray = []
//                         let count2 = 0

//                         if (data.comments.length !== 0) {
//                             for (var i = 0; i < data.comments.length; i++) {
//                                 commentIds.push(data.comments[i])
//                             }
//                             for (var i = 0; i < commentIds.length; i++) {
//                                 db.Comment.findOne({ _id: commentIds[i] }).then(commentData => {
//                                     commentsArray.push(commentData.body)
//                                     console.log(commentData.body)
//                                     count2++

//                                     if (count2 === commentIds.length) {
//                                         // console.log(commentsArray)
//                                         res.send({ array, id, commentsArray: commentsArray })
//                                     }
//                                 })

//                             }

//                         }
//                         else {
//                             let commentsArray = []
//                             res.send({ array, id, commentsArray })
//                         }
//                     }
//                 })
//             }

//         }

//     })
// });

router.post('/list/:id/:category', (req, res) => {
    db.List.findOne({_id: req.params.id}).populate("items").then(data => {
        console.log("\nSingular List Data: ", data, "\n");
        res.json(data);
    }).catch(err => {
        console.log(err);
        res.end()
    });
});

module.exports = router;