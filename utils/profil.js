"use strict";
let empty = require('is-empty');
let conn = require('../database/database');
let jwtUtils = require("./jwt.utils");

function profil(req,res){

    let data = jwtUtils.getUserID(req.cookies.token);
    if (data.email < 0) {
        res.render('index');
    }
    if (data.type < 0 || data.type !== "login") {
        res.render('index');
    } else {
        let sql = "SELECT * FROM Users JOIN Settings ON Users.user_id = Settings.user_id WHERE `email` = ?";//todo avec le token
        conn.query(sql, [data.email], function (error, results) {
            if (error) throw error;
            if (empty(results)) {
                res.render('index');
            } else {
                res.render('profil', {
                    first_name: results[0].first_name,
                    last_name: results[0].last_name,
                    username: results[0].username,
                    email: results[0].email,
                    age: results[0].age,
                    sex: results[0].sex,
                    orientation: results[0].orientation,
                    bio: results[0].bio,
                    tags: results[0].tags,
                    connected: true,
                });
            }
        });
    }
}


module.exports = profil;