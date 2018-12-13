"use strict";
const validator = require("validator");
const db = require("../database/database");
const jwtUtils = require("../utils/jwt.utils");
const distance = require("../utils/distance");
const dbUser = require("../database/user.js");
const check = require("../database/check_validity.js");
const sendMail = require('../utils/sendMail');
const geolib = require('geolib');

module.exports = function(io)
{
    io.on("connection", function (socket)
    {
        socket.on("register", async function (data) {
            if (await check.checkNewUser(data, db)) {
                dbUser.dbInsertNewUser(data);
                let token = jwtUtils.generateTokenForUser(data, "validation");
                socket.emit("tokenValidation", token);
                sendMail(data.email, token);
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
                db.query(sqlUpdate,[data.lat,data.lng, data.email], function (error, results, fields) {
                    if (error) throw error;
                });
                let sql = "SELECT * FROM Users WHERE email=?;";
                db.query(sql,[data.email], function (error, results, fields) {
                    if (error) throw error;
                    let token = jwtUtils.generateTokenForUser(results[0], "login");
                    // distance(15,token);
                    // console.log(distance(15,token));
                    socket.emit("tokenLogin", token);
                });
            }
        });

        socket.on("parametre", function (data) {
            // console.log(data);
        });

        socket.on("location", function (data) {
            let dist = geolib.getDistance(
                {latitude: data.lat, longitude: data.lng},
                {latitude: "48.896614", longitude: "2.3522219000000177"},100)
            console.log(dist / 1000+ "km");

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