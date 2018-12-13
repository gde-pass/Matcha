"use strict";
const validator = require("validator");
const db = require("../database/database");
const jwtUtils = require("../utils/jwt.utils");
const distance = require("../utils/distance");
const dbUser = require("../database/user.js");
const check = require("../database/check_validity.js");
const sendMail = require('../utils/sendMail');
const geolib = require('geolib');
const SocketO = require("../database/socketsOnline.js");
var cookie = require('cookie');
var cookieParser = require('cookie-parser');

var UserOnline = [];
var i;
var data = [];
module.exports = function(io)
{
    io.on("connection", function (socket)
    {
        var req = socket.request;
        var push = 0;

		if (req.headers.cookie) {
		req.cookie = cookie.parse(req.headers.cookie);
		    }
		// console.log('cookie id: ' , req.cookie.token);
        if (req.cookie.token) {
		data = jwtUtils.getUserID(req.cookie.token)
		// console.log('DATA: ', data);

        UserOnline = SocketO.SetStore(socket.id, UserOnline, data.Id);
        // console.log('NEW JSON Array', JSON.stringify(UserOnline));
        }

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
                    for (i in UserOnline) {
                        if (UserOnline[i].id_user == results[0].user_id) {
                                UserOnline[i].socketid = socket.id;
                                push = 1;
                            }
                        }
                    if (push == 0) {
                            UserOnline.push({
        					id_user: results[0].user_id,
        					socketid: socket.id
                        })
                        // console.log('NEW HOT JSON Array', JSON.stringify(UserOnline));
                    }

            })
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

        //SOCKET EVENT CHAT--------------------------------------//
		socket.on('chat', function (data) {
			socket.broadcast.emit('chat_rep', data);
			//PRIVATE MESSAGE---------------------------------------------//
			io.to(socket.id).emit('chat', data);
		});

		socket.on('typing', function (data) {
			socket.broadcast.emit('typing', data);
		});

        socket.on('disconnect', function() {

            // if (req.headers.cookie) {
    		// req.cookie = cookie.parse(req.headers.cookie);
    		//     }
    		// // console.log('cookie id: ' , req.cookie.token);
            // if (req.cookie.token) {
    		// data = jwtUtils.getUserID(req.cookie.token)
    		// // console.log('DATA: ', data);
            //
            // UserOnline = SocketO.DelStore(socket.id, UserOnline, data.Id);
            // console.log('DEL JSON Array', JSON.stringify(UserOnline));
            // }

        console.log('socket '+this.id+' disconnect');
    });


    });
};
