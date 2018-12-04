"use strict";
const validator = require("validator");
let jwtUtils = require('../utils/jwt.utils');
const express = require('express');

const dbUser = require("../database/user.js");
let db = require('../database/database');
const check = require("../database/check_validity.js");

module.exports = function(io)
{
    io.on("connection", function (socket)
    {
        socket.on("subscribe", async function (data) {
            if (await check.CheckNewUser(data, db)) {
                dbUser.dbInsertNewUser(data);
            } else {
                console.log("error somewhere");
                socket.emit("subscribeError");
            }
        });

        socket.on("login", function (data) {
            let token = jwtUtils.generateTokenForUser(data.email);
            socket.emit("tokenCreate", token);
            console.log(token);
        });

        socket.on("focusOutEmailSignUp", async function (email) {

            if (validator.isEmail(email) && !validator.isEmpty(email) &&
                validator.isLowercase(email) && check.checkEmailPattern(email)) {

                if (await check.checkEmailValidity(email, db) === false) {
                    socket.emit("focusOutEmailSignUpFalse", email);
                }
            }
        });
    });
};