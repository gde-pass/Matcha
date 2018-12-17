"use strict";
const validator = require("validator");
const db = require("../database/database");
const jwtUtils = require("../utils/jwt.utils");
const dbUser = require("../database/user.js");
const check = require("../database/check_validity.js");
const sendMail = require('../utils/sendMail');
let reset = require("../utils/reset_mail");

module.exports = function (io) {
    io.on("connection", function (socket) {
        socket.on("register", async function (data) {
            if (await check.checkNewUser(data, db)) {
                dbUser.dbInsertNewUser(data);
                let token = jwtUtils.generateTokenForUser(data, "validation");
                socket.emit("tokenValidation", token);
                sendMail(data.email, token, "validation");
            } else {
                socket.emit("registerError");
            }
        });

        socket.on("login", async function (data) {
            if (await check.checkLoginUser(data) === false) {
                socket.emit("loginError");
            } else if (await check.checkActivatedUser(data) === false) {
                socket.emit("loginActivatedError");
            } else {
                let sqlUpdate = "UPDATE Users SET latitude=?, longitude=? WHERE email=?;";
                db.query(sqlUpdate, [data.lat, data.lng, data.email], function (error, results, fields) {
                    if (error) throw error;
                });
                let sql = "SELECT * FROM Users WHERE email=?;";
                db.query(sql, [data.email], function (error, results, fields) {
                    if (error) throw error;
                    let token = jwtUtils.generateTokenForUser(results[0], "login");
                    socket.emit("tokenLogin", token);
                });
            }
        });

        socket.on("parametre", async function (data) {
            if (await check.checkSettingsUpdate(data) === false) {
                socket.emit("settingsUpdateFalse");
            } else {
                await dbUser.dbSettingsUpdate(data);
                socket.emit("settingsUpdateTrue");
            }
        });

        socket.on("forgot", async function (data) {
            let token = jwtUtils.generateTokenForUser(data, "reset");
            sendMail(data.email, token, "reset");
            io.sockets.emit('forgotSend', data);
        });

        socket.on("reset", async function (data) {
            if (await check.checkReset(data) === false) {
                socket.emit("ResetError");
            } else {
                socket.emit("ResetSuccess");
            }
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