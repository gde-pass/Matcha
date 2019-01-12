"use strict";
const validator = require("validator");
// const sanitizeHtml = require("sanitize-html");
const cookie = require("cookie");
const db = require("../database/database");
const jwtUtils = require("../utils/jwt.utils");
const dbUser = require("../database/user.js");
const check = require("../database/check_validity.js");
const sendMail = require('../utils/sendMail');
const geolib = require('geolib');
const SocketO = require("../database/socketsOnline.js");
const dbmessage = require("../database/message.js");
const notif = require("../database/db_notif.js");
const dbmatch = require("../database/db_matchs.js");
const findIfMatch = require('../utils/find_If_matched');


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
            // console.log('DATA : ', socket.data);
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
                db.query(sqlUpdate, [data.lat, data.lng, data.email], function (error,) {
                    if (error) throw error;
                });
                let sql = "SELECT * FROM Users WHERE email=?;";
                db.query(sql, [data.email], function (error, results) {
                    if (error) throw error;
                    let token = jwtUtils.generateTokenForUser(results[0], "login");
                    socket.emit("tokenLogin", token);
                    // let sqlOnline = "INSERT INTO Useronline (user_id, username, online, socketid, in_conv) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE user_id= ?";
                    // db.query(sqlOnline,[results[0].user_id,results[0].username, 'Y', socket.id, 0, results[0].user_id], function (error) {
                    //     if (error) throw error;
                    //
                    // });
            })
        }
        });

        socket.on("visite", function (data) {
            dbUser.visiteUser(data);
        });

        socket.on("report", async function (data) {
            if (await check.reportedUser(data) === true) {
                socket.emit("reportFalse");
            } else {
                dbUser.reportUser(data);
                socket.emit("reportTrue");
            }

        });

        socket.on("parametre", async function (data) {
            if (await check.checkSettingsUpdate(data) === false) {
                socket.emit("settingsUpdateFalse");
            } else if (await check.checkEmailValidity(data.email, db) === false) {
                socket.emit("settingsUpdateFalse");
            } else if (await check.checkUsernameValidity(data.username, db) === false) {
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

        socket.on("focusOutUsernameSignUp", async function (username) {
            if (!validator.isEmpty(username) && check.checkUserPattern(username)) {

                if (await check.checkUsernameValidity(username, db) === false) {
                    socket.emit("focusOutUsernameSignUpFalse", username);
                }
            }
        });

        //SOCKET EVENT CHAT--------------------------------------//
		socket.on('chat', async function (data) {
            // data.message = sanitizeHtml(data.message, {
            //                   allowedTags: false,
            //                   allowedAttributes: false,
            //                 });
            // console.log('CLEAN : ', clean_mess);
            let gparams = await SocketO.Getparams(data.to);
            let niu2 = ","; //c'est mooooooche !!!
                niu2 += await dbUser.dbSelectIdUserByUsername(data.to);
            let params = {
                from_user_id: socket.data.user_id,
                to_user_id: gparams.user_id,
                message: data.message
                };
            if (await dbmatch.IsMatch(socket, niu2) == true ) {
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
            }else {
                io.to(socket.id).emit('chatnomatch', data);
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


        //SOCKET EVENT NOTIF --------------------------------------//
        socket.on('create_notif', async function (data) {
            let niu2 = ","; //c'est mooooooche !!!
            let gparams = await SocketO.Getparams(data.user);
            let niu = await dbUser.dbSelectIdUserByUsername(data.user);
                niu2 += await dbUser.dbSelectIdUserByUsername(data.user);
            if ((data.type == 1 && data.like == "Like")) {
                notif.CreateNotif(socket, data, niu);
                io.to(gparams.socketid).emit('notification_box');
                if (await dbmatch.WasMatch(socket, niu2) == true) {
                    data.type = 3;
                    notif.CreateNotif(socket, data, niu);
                    notif.CreateNotifMatch(socket, data, niu);
                    io.to(gparams.socketid).emit('notification_box');
                    io.to(socket.id).emit('notification_box');
                }
            }else if (data.type == 2) {
                if (await dbmatch.IsMatch(socket, niu2) == true ) {
                    notif.CreateNotif(socket, data, niu);
                    io.to(gparams.socketid).emit('notification_box');
                }
            }else if (data.type == 1 && await dbmatch.WasMatch(socket, niu2) == true){
                    data.type = 4;
                    notif.CreateNotif(socket, data, niu);
                    io.to(gparams.socketid).emit('notification_box');
            }
        });

        socket.on('unread', async function () {
            let getunread = "SELECT COUNT (*) AS nb FROM Notifications WHERE to_user_id=? AND unread=?";
            db.query(getunread, [socket.data.user_id, 1], function (error, results) {
                if (error) throw error;
                socket.emit('getunread', results[0].nb);
            });
        });

        socket.on('read', async function () {
            let upread = "UPDATE Notifications SET unread = REPLACE(unread, ?, ?) WHERE to_user_id=?";
            db.query(upread, [ 1, 0, socket.data.user_id], function (error, results) {
                if (error) throw error;
                socket.emit('read');
            });
        })

        socket.on('getnotif', function () {
            let getnotif = "SELECT * , DATE_FORMAT(date_n , '%d/%m/%Y %H:%i:%s') AS date FROM Notifications WHERE to_user_id=? ORDER BY notif_id DESC";
            db.query(getnotif, [socket.data.user_id], function (error, results) {
                if (error) throw error;
                socket.emit('getnotif', results);
            });
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
