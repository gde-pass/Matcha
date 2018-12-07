"use strict";
const express = require("express");
const empty = require("is-empty");
let jwtUtils = require("../utils/jwt.utils");

const router = express.Router();
let conn = require("../database/database");
let profil = require("../utils/profil");


router.get("/", function (req, res) {
    res.render("index");
});

router.get("/login", function (req, res) {
    // console.log(req.get(token));
    res.render('login',{output: req.params.token});
});

// router.get("/validation/:token", function (req, res) {
//
//     let email = jwtUtils.getUserID(req.params.token);
//
//     if (email < 0) {
//         console.log(email);
//         res.render('login', {
//             error: "Token is not valid"
//         })
//     }
//     let sqlCheck = 'SELECT * FROM Users WHERE email=?';
//     conn.query(sqlCheck, [email], function (error, results, fields) {
//         if (error) throw error;
//         if(empty(results)) {
//             console.log("no users");
//             res.render('login', {
//                 error: "There are no users for ths Token"
//             })
//         }
//         else {
//             let sqlValidate = 'UPDATE Users set Users WHERE email=?';
//             conn.query(sqlValidate, [email], function (error, results, fields) {
//                 if (error) throw error;
//                 if(empty(results)) {
//                     console.log("no users");
//                     res.render('login', {
//                         error: "There are no users for ths Token"
//                     })
//                 }
//
//             res.render('login',{
//                 success: "Your has been validated with success !"
//             });
//         }
//     });
//     // res.render('login',{output: req.params.token});
// });


router.get("/register", function (req, res) {
    res.render('register');

});

router.get("/single", function (req, res) {
    res.render("single");

});

router.get("/about", function (req, res) {
    res.render("about");

});

router.get("/contact", function (req, res) {
    res.render("contact");

});
router.get("/profil", function (req, res) {
    profil(req,res);
});

router.use(function (req, res) {
    res.render("404");
});

module.exports = router;