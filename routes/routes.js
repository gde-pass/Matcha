"use strict";
const express = require("express");
const router = express.Router();


router.get("/", function (req, res) {
    res.render("index");
});

router.get("/login", function (req, res) {
    // console.log(req.get(token));
    res.render('login');
});

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

// router.use(function (req, res) {
//     res.render("404");
// });

module.exports = router;