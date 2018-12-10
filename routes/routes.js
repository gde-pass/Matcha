"use strict";
const express = require("express");

const router = express.Router();
let profil = require("../utils/profil");
let validation = require("../utils/email_validation");

router.get("/", function (req, res) {
    if(typeof req.cookies.token === "undefined") {
        res.render('index',{
            connected : false
        });
    }else {
        res.render('index',{
            connected : true
        });
    }
});

router.get("/login", function (req, res) {
    if(typeof req.cookies.token === "undefined") {
        res.render('login');
    }else {
        res.render('index',{
            connected : true
        });
    }
});

router.get("/validation/:token", function (req, res) {
    validation(req, res, req.params.token);
});

router.get("/register", function (req, res) {
    if(typeof req.cookies.token === "undefined") {
        res.render('register');
    }else {
        res.render('index',{
            connected : true
        });
    }
});

router.get("/single", function (req, res) {
    if(typeof req.cookies.token === "undefined") {
        res.render('single',{
            connected : false
        });
    }else {
        res.render('single',{
            connected : true
        });
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
        res.render('index',{
            connected : false
        });
    }else {
        profil(req, res);
    }
});

router.get("/logout", function (req, res) {
    if(typeof req.cookies.token === "undefined") {
        res.render('index',{
            connected : false
        });
    }else {
        res.clearCookie("token");
        res.render('index',{
            connected : false
        });
    }
});

router.use(function (req, res) {
    res.render("404");
});

module.exports = router;