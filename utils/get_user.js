"use strict"
let empty = require('is-empty');
let conn = require('../database/database');
let replace = require("str-replace");
const glob = require('glob');

function display_users(req, res, connected) {
    let url  = req.url;
    url = replace.all("/single?").from(url).with("");

    let sql = "SELECT * FROM Users JOIN Settings ON Users.user_id = Settings.user_id WHERE `username` = ?";
    conn.query(sql, url, function (errors, results, fields) {
        if (errors) throw errors;
        glob(`*/assets/images/${results[0].username}${results[0].user_id}img*`, function (err, files_img) {
            // var gallery_img = path.basename(files.toString());
            if (empty(files_img))
                files_img = 'undefined';
            var images = [];
            for (let i = 0; i < files_img.length; i++) {
                images.push(replace.all("public").from(files_img[i]).with(""));
            }
            res.render('single', {
                connected: connected,
                user: results[0],
                files_img: images,
            })
        })
    })
}

module.exports = display_users;