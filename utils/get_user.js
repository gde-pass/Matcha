"use strict"
let empty = require('is-empty');
let conn = require('../database/database');
let replace = require("str-replace");


function display_users(req, res, connected) {
    let url  = req.url;
        url = replace.all("/single?").from(url).with("");
    let sql = "SELECT * FROM Users WHERE username = ?";
    conn.query(sql, url, function (errors, results, fields) {//todo faire un tableau avec toute les donner et les renvoyer a la page ejs
        if (errors) throw errors;
        res.render('single',{
            connected : connected,
            user : results[0],
        })
    })
}

module.exports = display_users;