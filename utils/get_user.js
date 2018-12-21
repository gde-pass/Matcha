"use strict"
let empty = require('is-empty');
let conn = require('../database/database');
let replace = require("str-replace");
const glob = require('glob');
let jwtUtils = require("./jwt.utils");
let findIfMach = require('./find_If_matched');
let findIfLiked = require('./find_If_liked');

let like;
let asLikedYou;
let check = 0;
let score = 0;

function findScore(user, cb) {
    let tabscore = [];
    let sql = "SELECT score FROM score WHERE user_that_is_scored = ?";
    conn.query(sql, user, function (err, resu) {
        if (err) throw err;
        else {
            resu.forEach(function (elem) {
                tabscore.push(elem.score)
            })
            var sum = tabscore.reduce(add, 0);

            function add(a, b) {
                return a + b;
            }

            cb(null, sum / tabscore.length)
        }
    })
}

function findNbEtoile(user, cb) {
    let sql = "SELECT score FROM score WHERE user_that_is_scored = ?";
    conn.query(sql, user, function (err, resu) {
        if (err) throw err;
        else {
            if (!empty((resu))) {
                cb(null, resu[0].score)
            } else {
                cb(null, resu)
            }
        }
    })
}

function get_user(req, res, connected, user = '@2584!@@@##$#@254521685241@#!@#!@#@!#') {
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
        let sql = "SELECT * FROM Users JOIN Settings ON Users.user_id = Settings.user_id WHERE `username` = ?";
        conn.query(sql, url, function (errors, results, fields) {
            if (errors) throw errors;
            glob(`*/assets/images/${results[0].username}${results[0].user_id}img*`, function (err, files_img) {
                if (empty(files_img)) {
                    files_img = "";
                }
                var images = [];
                for (let i = 0; i < files_img.length; i++) {
                    images.push(replace.all("public").from(files_img[i]).with(""));
                }
                let sql = "SELECT * FROM matchs WHERE user1_id = ?";
                conn.query(sql, data.Id, function (err, resu) {
                    if (err) throw err;
                    var filtered = resu[0].users_you_liked.split(',').filter(function (value) {
                        if (value == results[0].user_id)
                            return (true)
                    });
                    if (filtered == results[0].user_id) {
                        like = "Dislike";
                    } else
                        like = "Like";
                    findNbEtoile(results[0].user_id, function (err, etoiles) {
                        check = etoiles;
                    })
                    findScore(results[0].user_id, function (err, sumScore) {
                        if (isNaN(sumScore))
                            score = 0;
                        else
                            score = sumScore;
                    })


                    findIfLiked(req, res, data, url, function (err, liked) {
                        if (err) {

                        } else {
                            asLikedYou = liked;
                            // console.log(asLikedYou)
                        }
                    })
                    findIfMach(req, res, data, url, function (err, match) {
                        if (err) {
                            // error handling
                        }
                        if (results[0].profil_img == 0)
                            like = null;
                        res.render('single', {
                            connected: connected,
                            user: results[0],
                            etoiles: check,
                            score: score,
                            files_img: images,
                            like: like,
                            match: match,
                            asLikedYou: asLikedYou
                        })
                    })
                });
            })
        })
    }
}

module.exports = get_user;