"use strict"
let empty = require('is-empty');
let conn = require('../database/database');

function display_users(req, res, connected) {
    let sql = "SELECT * FROM Users";
    conn.query(sql, function (errors, results, fields) {
        if (errors) throw errors;
        res.render('index',{
            connected : connected,
            users : results,
        })
    })
}

module.exports = display_users;