// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcrypt");
// // const jwt = require("jsonwebtoken");
// const keys = require("../../config/keys");

// const validateRegisterInput = require("../../validation/register");
// const validateLoginInput = require("../../validation/login");

// const User = require("../../models/User");

// // validates new user registration and saves new user data to the db
// router.post("/register", function(req, res) {
//     console.log(req.body);
//     const {errors, isValid} = validateRegisterInput(req.body);

//     if (!isValid) {
//         return res.status(400).json(errors);
//     }

//     User.findOne({username: req.body.username}).then(user => {
//         if (user) {
//             return res.status(400).json({username: "Username is already in use - please choose another"});
//         } else {
//             const newUser = {
//                 firstName: req.body.firstName,
//                 lastName: req.body.lastName,
//                 username: req.body.username,
//                 email: req.body.email,
//                 password: req.body.password
//             }
//             bcrypt.genSalt(10, (err, salt) => {
//                 if (err) throw err;
//                 bcrypt.hash(newUser.password, salt, (err, hash) => {
//                     if (err) throw err;
//                     newUser.password = hash;
//                 });
//             });
//             User.create(newUser).then(user => {
//                 res.json(user);
//             }).catch(err => {
//                 console.log(err);
//             });
//         }
//     });
// });

// module.exports = router;