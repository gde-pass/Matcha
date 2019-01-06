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

function findNbEtoile(user, cb) {
    let sql = "SELECT score FROM score WHERE user_that_is_scored = ?";
    conn.query(sql, user, function (err, resu) {
        if (err)  return (res.status(500).end());
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
            if (errors) return (res.status(500).send(error.sqlMessage));
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
                    if (err) return (res.status(500).send(error.sqlMessage));
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
                    findIfLiked(req, res, data, url, function (err, liked) {
                        if (err) {
                            console.log(err)
                        } else {
                            asLikedYou = liked;
                        }
                    })
                    findIfMach(req, res, data, url, function (err, match) {
                        if (err) {
                            console.log(err)
                        }
                        if (results[0].profil_img == 0)
                            like = null;
                        res.render('single', {
                            connected: connected,
                            user: results[0],
                            etoiles: check,
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