"use strict";

const check = require("./database/check_validity.js");
const db = require("./server.js");
const validator = require("validator");

module.exports = function(io)
{
    io.on("connection", function (socket)
    {
        socket.on("subscribe", function (data) {
            console.log(data);
            // if (check.CheckNewUser(data)) {
            //     let sql = "";
            //     db.pool.query(sql, []);
            // }
        });

        socket.on("login", function (data) {
            console.log(data);
        });

        socket.on("focusOutEmailSignUp", async function (email) {

            if (validator.isEmail(email) && !validator.isEmpty(email) &&
                validator.isLowercase(email) && check.CheckEmailPattern(email)) {

                if (await check.CheckEmailValidity(email, db.pool) === false) {
                    socket.emit("focusOutEmailSignUpFalse", email);
                }
            }
        });
    });
};