"use strict";
const express = require("express");
const router = express.Router();


router.get("/", function (req, res) {
    res.render("index");
});

router.get("/email", function (req, res) {
    res.render("login_signin/email");
});

router.get("/home", function (req, res) {
    res.render("home");
});

router.get("/login/:token", function (req, res) {
    console.log(req.get(token));
    res.render('login');
});

router.get("/register", function (req, res) {
    res.render('register');
});

router.get("/single", function (req, res) {
    res.render("single");
});
// router.use(function(req, res) {
//     res.render("404");
// });
//
module.exports = router;