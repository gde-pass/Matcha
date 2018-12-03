"use strict";
const express = require('express');
const router = express.Router();


    router.get("/", function (req, res) {
        res.render('index');
        // res.write(fs.readFileSync("js/cover.js"));
        // res.end();
    });

    router.get("/email", function (req, res) {
        res.render('login_signin/email');

    });

    router.use(function(req, res) {
        res.render("404");
    });
module.exports = router;