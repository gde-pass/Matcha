"use strict";
const express = require("express");

const router = express.Router();
let profil = require("../utils/profil");
let chat = require("../utils/chat");
let upload_profil = require("../utils/upload_profil");
let upload_img = require("../utils/upload_img");
let display_users = require("../utils/display_users");
let get_user = require("../utils/get_user");
let validation = require("../utils/email_validation");

router.get("/", function (req, res) {
    if(typeof req.cookies.token === "undefined") {
        display_users(req, res, false);
    }else {
        display_users(req, res, true);
    }
});

router.get("/login", function (req, res) {
    if(typeof req.cookies.token === "undefined") {
        res.render('login');
    }else {
        display_users(req, res, true);
    }
});

router.get("/validation/:token", function (req, res) {
    validation(req, res, req.params.token);
});

router.get("/register", function (req, res) {
    if(typeof req.cookies.token === "undefined") {
        res.render('register');
    }else {
        display_users(req, res, true);
    }
});

router.get("/single", function (req, res) {

    if(typeof req.cookies.token === "undefined") {
        get_user(req, res, false)
    }else {
        get_user(req, res, true)
    }
});

router.get("/chat", function (req, res) {
    if(typeof req.cookies.token === "undefined") {
        res.render('index',{
            connected : false
        });
    }else {
        chat(req, res);
    }
});

router.get("/about", function (req, res) {
    if(typeof req.cookies.token === "undefined") {
        res.render('about',{
            connected : false
        });
    }else {
        res.render('about',{
            connected : true
        });
    }
});

router.get("/contact", function (req, res) {
    if(typeof req.cookies.token === "undefined") {
        res.render('contact',{
            connected : false
        });
    }else {
        res.render('contact',{
            connected : true
        });
    }
});
router.get("/profil", function (req, res) {
    if(typeof req.cookies.token === "undefined") {
        display_users(req, res, false);
    }else {
        profil(req, res);
    }
});

router.get("/logout", function (req, res) {
    if(typeof req.cookies.token === "undefined") {
        display_users(req, res, false);
    }else {
        res.clearCookie("token");
        display_users(req, res, false);
    }
});

router.get("/map", function (req, res) {
    res.render('map');
});

router.post("/upload", function (req, res) {
    upload_profil(req, res);
});

router.post("/upload_img", function (req, res) {
    upload_img(req, res);
});


router.use(function (req, res) {
    res.render("404");
});

module.exports = router;
