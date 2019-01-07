"use strict";
const validator = require("validator");
const cookie = require("cookie");
const db = require("../database/database");
const jwtUtils = require("../utils/jwt.utils");
const dbUser = require("../database/user.js");
const check = require("../database/check_validity.js");
const sendMail = require('../utils/sendMail');
const geolib = require('geolib');
const SocketO = require("../database/socketsOnline.js");
const dbmessage = require("../database/message.js");

let dataToken = [];

module.exports = function(io)
{
    io.on("connection", function (socket)
    {
        let req = socket.request;

		if (req.headers.cookie) {
		req.cookie = cookie.parse(req.headers.cookie);
            if (req.cookie.token) {
                dataToken = jwtUtils.getUserID(req.cookie.token);
            socket.data = {
                user_id: dataToken.Id,
                username: dataToken.username,
                email: dataToken.email
            };
            let sqlSetSocket = "UPDATE Useronline SET socketid= ?, online=? , in_conv=? WHERE user_id= ?";
                db.query(sqlSetSocket, [socket.id, 'Y', 0, dataToken.Id], function (error) {
                    if (error)throw error;
                });
            }
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
                db.query(sqlUpdate, [data.lat, data.lng, data.email], function (error,) {
                    if (error) throw error;
                });
                let sql = "SELECT * FROM Users WHERE email=?;";
                db.query(sql, [data.email], function (error, results) {
                    if (error) throw error;
                    let token = jwtUtils.generateTokenForUser(results[0], "login");
                    // distance(15,token);
                    // console.log(distance(15,token));
                    socket.emit("tokenLogin", token);

                    let sqlOnline = "INSERT INTO Useronline (user_id, username, online, socketid, in_conv) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE user_id= ?";
                    db.query(sqlOnline,[results[0].user_id,results[0].username, 'Y', socket.id, 0, results[0].user_id], function (error) {
                        if (error) throw error;
                    });
            })
        }
        });

        socket.on("location", function (data) {
            let dist = geolib.getDistance(
                {latitude: data.lat, longitude: data.lng},
                {latitude: "48.896614", longitude: "2.3522219000000177"}, 100);
            console.log(dist / 1000 + "km");
        });

        socket.on("parametre", async function (data) {
            if (await check.checkSettingsUpdate(data) === false) {
                socket.emit("settingsUpdateFalse");
            } else {
                await dbUser.dbSettingsUpdate(data);
                socket.emit("settingsUpdateTrue");
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

        //SOCKET EVENT CHAT--------------------------------------//
		socket.on('chat', async function (data) {
            let gparams = await SocketO.Getparams(data.to);
            let params = {
                from_user_id: socket.data.user_id,
                to_user_id: gparams.user_id,
                message: data.message
                };
            if (await dbmessage.InsertMessage(params)){
                  io.to(socket.id).emit('chat', data);
                if (await SocketO.CheckConv(params) === true) {
                 // PRIVATE MESSAGE---------------------------------------------//
          			io.to(gparams.socketid).emit('chat_rep', data);
                  }else {
                    io.to(gparams.socketid).emit('notifnew', socket.data.username);
                  }
            }else {
                console.log('error insert db message');
            }
        });

		socket.on('getmessage', async function (data) {
                let params = {
                    from_user_id: socket.data.user_id,
                    to_user_id: await SocketO.Getparams(data)
                    };
                let tmp_res = {
                    message: await dbmessage.GetMessage(params),
                    from_user_id: socket.data.user_id
                };
                SocketO.SetConv(params);
                socket.emit('getmessage', tmp_res);
		});

		socket.on('typing', function (data) {
			socket.broadcast.emit('typing', data);
		});

        socket.on('disconnect', function() {
    		if (req.headers.cookie) {
        		req.cookie = cookie.parse(req.headers.cookie);
                if (req.cookie.token) {
            		dataToken = jwtUtils.getUserID(req.cookie.token);

                    let sqldisconnect = "UPDATE Useronline SET online= ?, socketid= ? WHERE user_id= ?";
                    db.query(sqldisconnect,['N','0',dataToken.Id], function (error) {
                        if (error) throw error;
                    });
                }
            }
        console.log('socket '+this.id+' disconnect');
        });


    });
};
