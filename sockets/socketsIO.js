"use strict";
const validator = require("validator");
let jwtUtils = require("../utils/jwt.utils");
const empty = require("is-empty");
let conn = require("../database/database");

const dbUser = require("../database/user.js");
let db = require("../database/database");
const check = require("../database/check_validity.js");
let sendMail = require('../utils/sendMail');

module.exports = function(io)
{
    io.on("connection", function (socket)
    {
        socket.on("subscribe", async function (data) {
            if (await check.checkNewUser(data, db)) {
                dbUser.dbInsertNewUser(data);
                let token = jwtUtils.generateTokenForUser(data, "validation");
                socket.emit("tokenValidation", token);
                sendMail(data.email, token);
            } else {
                console.log("error somewhere");
                socket.emit("subscribeError");
            }
        });

        socket.on("login", function (data) {
            let sql = "SELECT * FROM Users WHERE email=?;";
            conn.query(sql,[data.email], function (error, results, fields) {
                if(error) throw error;
               if(empty(results)){
                   console.log("There are no users for this email")//todo afficher le message d'erreur
               } else if(results[0].checked == 0){
                   console.log("You must activate your account to login, please check your mails")//todo afficher le message d'erreur
               }else{
                   let token = jwtUtils.generateTokenForUser(results[0], "login");
                   socket.emit("tokenLogin", token);
                   console.log(token);
               }
            });
        });

        socket.on("parametre", function (data) {
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