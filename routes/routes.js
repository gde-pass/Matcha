"use strict";
const express = require("express");

const router = express.Router();
let profil = require("../utils/profil");
let delete_img = require("../utils/delete_img");
let recherche = require("../utils/recherche");
let chat = require("../utils/chat");
let upload_profil = require("../utils/upload_profil");
let upload_img = require("../utils/upload_img");
let display_users = require("../utils/display_users");
let score = require("../utils/score");
let get_user = require("../utils/get_user");
let validation = require("../utils/email_validation");
let jwtUtils = require("../utils/jwt.utils");

router.get("/", function (req, res) {
    if(typeof req.cookies.token === "undefined") {
        display_users(req, res, false);
    }else {
        display_users(req, res, true);
    }
});

router.get("/login", function (req, res) {
    let check = jwtUtils.getUserID(req.cookies.token);

    if (check.exp < Date.now() / 1000) {
        res.clearCookie("token");
        res.render('login')
    }
    else if (typeof req.cookies.token === "undefined") {
        res.render('login');
    }else {
        display_users(req, res, true);
    }
});

router.get("/validation/:token", function (req, res) {
    res.cookie('validation', req.params.token, { maxAge: 900000, httpOnly: true });
    validation(req, res, req.params.token);
});

router.get("/reset/:token", function (req, res) {
    console.lo
    res.render('reset');
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
        display_users(req, res, false);
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

router.post("/delete_img", function (req, res) {
    delete_img(req, res);
});

router.get("/logout", function (req, res) {
    if(typeof req.cookies.token === "undefined") {
        res.render('login');
    }else {
        res.clearCookie("token");
        res.redirect('/');
        // display_users(req, res, false);
    }
});

router.get("/map", function (req, res) {
    res.render('map');
});

router.get("/forgot", function (req, res) {
    res.render('forgot');
});

router.get("/recherche", function (req, res) {
    if(typeof req.cookies.token === "undefined") {
        res.render('login');
    }else {
        res.render('recherche', {
            connected: true,
            users: 1
        });
    }
});

router.post("/recherche", function (req, res) {
    recherche(req, res, true);
});

router.post("/score", function (req, res) {
    score(req, res);
});

router.post("/upload", function (req, res) {
    upload_profil(req, res);
});

router.post("/upload_img", function (req, res) {
    upload_img(req, res);
});

router.get("/nojs", function (req, res) {
    res.render('nojs');
});

module.exports = router;
