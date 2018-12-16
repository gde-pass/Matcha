"use strict"
let empty = require('is-empty');
let conn = require('../database/database');
let replace = require("str-replace");
const glob = require('glob');
let jwtUtils = require("./jwt.utils");
let like;

function display_users(req, res, connected, user = '@2584!@@@##$#@254521685241@#!@#!@#@!#') {

    let data = jwtUtils.getUserID(req.cookies.token);
    if (data.type < 0 || data.type !== "login" || data.email < 0) {
        res.redirect("/");
    } else {
        let url = req.url;
        if (url.search("match?") > 0) {
            url = user
        } else
            url = replace.all("/single?").from(url).with("");

        let sql = "SELECT * FROM Users JOIN Settings ON Users.user_id = Settings.user_id WHERE `username` = ?";
        conn.query(sql, url, function (errors, results, fields) {
            if (errors) throw errors;
            glob(`*/assets/images/${results[0].username}${results[0].user_id}img*`, function (err, files_img) {
                if (empty(files_img))
                    files_img = 'undefined';
                var images = [];
                for (let i = 0; i < files_img.length; i++) {
                    images.push(replace.all("public").from(files_img[i]).with(""));
                }

                let sql = "SELECT * FROM matchs WHERE user1_id = ?";
                conn.query(sql, data.Id, function (err, resu) {
                    if (err) throw err;

                    var filtered = resu[0].user2_id.split(',').filter(function (value) {
                        if (value == results[0].user_id)
                            return (true)
                    });
                    if (filtered == results[0].user_id) {
                        like = "Dislike";
                    }
                    else
                        like = "Like";

                    res.render('single', {
                        connected: connected,
                        user: results[0],
                        files_img: images,
                        like: like
                    })
                });
            })
        })
    }
}

module.exports = display_users;