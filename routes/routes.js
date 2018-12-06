"use strict";
const express = require("express");
const router = express.Router();


router.get("/", function (req, res) {
    res.render("index");
});

router.get("/profil", function (req, res) {
    res.render('profil');

});

router.get("/login", function (req, res) {
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

router.get("/profiles", function (req, res) {
    res.render("profiles");

});


router.get("/contact", function (req, res) {
    res.render("contact");

});


router.use(function (req, res) {
    res.render("404");
});

module.exports = router;