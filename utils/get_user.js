"use strict"
let empty = require('is-empty');
let conn = require('../database/database');
let replace = require("str-replace");
const glob = require('glob');
let jwtUtils = require("./jwt.utils");
let findIfMach = require('./find_If_matched');
let findIfLiked = require('./find_If_liked');
let score1 = require('./score');
let like;
let asLikedYou;
let bloque;
let check = 0;

function findScore(req, res, user, cb) {
    let sql = "SELECT score FROM Users WHERE user_id = ?";
    conn.query(sql, user, function (err, resu) {
        if (err) return (res.send(err.sqlMessage));
        else {
            // console.log(resu[0].score);
            cb(null, resu[0].score)
        }
    })
}

function findNbEtoile(user, cb) {
    let sql = "SELECT score FROM score WHERE user_that_is_scored = ?";
    conn.query(sql, user, function (err, resu) {
        if (err)  return (res.send(err.sqlMessage));
        else {
            if (!empty((resu))) {
                cb(null, resu[0].score)
            } else {
                cb(null, resu)
            }
        }
    })
}
function findIfBloque(req, res, Id, cb){
    let sql = "SELECT is_bloqued FROM list_bloquer WHERE user_id = ?";
    conn.query(sql,Id,function (err, resu) {
        if (err)  return (res.send(err.sqlMessage));
        else {
            if (resu[0].is_bloqued == 0) {
                cb(null, "Bloquer")
            } else {
                cb(null, "Unblock")
            }
        }
    })
}

function cal_score(req, res, ID, username){
    let scor = 0;
    let sql = "SELECT users_that_liked_you FROM matchs WHERE user1_id=?";
    conn.query(sql,ID, function (err, result) {
        if(err) return (res.send(err.sqlMessage));
        let tab = result[0].users_that_liked_you.split(',');
        let nbLikes = tab.length;
        let sql = "SELECT * FROM Visites WHERE username =?";
        conn.query(sql, username, function (err, resu) {
            if(err) return (res.send(err.sqlMessage));
            let nbVisite = resu.length;
            let score = (nbLikes /nbVisite) * 5;
            findScore(req, res, ID, function (err, sumScore) {
                if (isNaN(sumScore))
                    scor = 0;
                else
                    if(sumScore != 1 && score !=Infinity) {
                        scor = (sumScore + score) / 2;
                        let sql = "UPDATE Users SET score = ? WHERE user_id = ?";
                        conn.query(sql, [scor, ID], function (err, resul) {
                            if (err) return (res.send(err.sqlMessage));
                            else {
                                return true;
                            }
                        })
                    }
            })
        })
    })
}

async function get_user(req, res, connected, user = '@2584!@@@##$#@254521685241@#!@#!@#@!#') {
    let data = jwtUtils.getUserID(req.cookies.token);
    if (data.type < 0 || data.type !== "login" || data.email < 0) {
        res.redirect("/");
    } else {
        let url = req.url;
        if (url.search("match?") > 0) {
            url = user
        } else if (url.search("score?") > 0) {
            url = user
        } else
            url = replace.all("/single?").from(url).with("");
        if (url == data.username) {
            res.redirect('/');
        } else {

            let sql = "SELECT * , DATE_FORMAT(last_connection , '%d/%m/%Y %H:%i:%s') AS date FROM Users INNER JOIN Settings ON Settings.user_id = Users.user_id INNER JOIN Useronline ON Useronline.user_id = Users.user_id WHERE Users.username = ?";
            // let sql = "SELECT * FROM Users JOIN Settings ON Users.user_id = Settings.user_id JOIN WHERE username = ?";
            conn.query(sql, url, function (errors, results, fields) {
                if (errors) return (res.send(errors.sqlMessage));
                if (!empty(results)) {
                    glob(`*/assets/images/${results[0].username}${results[0].user_id}img*`, function (err, files_img) {
                        if (empty(files_img)) {
                            files_img = "";
                        }
                        var images = [];
                        for (let i = 0; i < files_img.length; i++) {
                            images.push(replace.all("public").from(files_img[i]).with(""));
                        }

                        let sql = "SELECT * FROM matchs WHERE user1_id = ?";
                        conn.query(sql, data.Id, async function (err, resu) {
                            if (err) return (res.send(err.sqlMessage));
                            var filtered = resu[0].users_you_liked.split(',').filter(function (value) {
                                if (value == results[0].user_id)
                                    return (true)
                            });
                            if (filtered == results[0].user_id) {
                                like = "Dislike";
                            } else
                                like = "Like";
                            cal_score(req, res,results[0].user_id, url);
                            findNbEtoile(results[0].user_id, function (err, etoiles) {
                                check = etoiles;
                            });
                            findIfLiked(req, res, data, url, function (err, liked) {
                                if (err) {
                                    // console.log(err)
                                } else {
                                    asLikedYou = liked;
                                }
                            });
                            findIfBloque(req, res, results[0].user_id, function (err, bloqued) {
                                if (err) {
                                    // console.log(err)
                                } else
                                    bloque = bloqued;
                            });
                            findIfMach(req, res, data, url, function (err, match) {
                                if (err) {
                                    // console.log(err)
                                }
                                if (results[0].profil_img == 0)
                                    like = null;
                                res.render('single', {
                                    connected: connected,
                                    username : url,
                                    user: results[0],
                                    etoiles: check,
                                    files_img: images,
                                    like: like,
                                    match: match,
                                    bloqued: bloque,
                                    asLikedYou: asLikedYou,
                                    status: results[0].online,
                                    last_c: results[0].date
                                })
                            })
                        });
                    })
                }else{
                    res.redirect('/');
                }
            })
        }
    }
}

module.exports = get_user;
