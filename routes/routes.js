"use strict";
const express = require("express");
const empty = require("is-empty");
let jwtUtils = require("../utils/jwt.utils");

const router = express.Router();
let profil = require("../utils/profil");
let validation = require("../utils/email_validation");



router.get("/", function (req, res) {
    res.render("index");
});

router.get("/login", function (req, res) {
    res.render('login');
});

router.get("/validation/:token", function (req, res) {
    validation(req, res, req.params.token);
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
router.get("/profil", function (req, res) {
    if(typeof req.cookies.token === "undefined")
    {
        res.render('index');
    }else {
        profil(req, res);
    }
});

// router.use(function (req, res) {
//     res.render("404");
// });

module.exports = router;