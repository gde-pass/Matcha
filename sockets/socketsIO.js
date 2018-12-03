"use strict";

const check = require("../database/check_validity.js");
const validator = require("validator");
const dbUser = require("../database/user.js");
let db = require('../database/database');

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
            console.log(data);
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