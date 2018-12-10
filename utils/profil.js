"use strict";
let empty = require('is-empty');
let conn = require('../database/database');
let jwtUtils = require("./jwt.utils");

function profil(req,res){

    let data = jwtUtils.getUserID(req.cookies.token);
    console.log(data.email);
    if (data.email < 0) {
        res.render('index');
    }
    if (data.type < 0 || data.type != "login") {
        res.render('index');
    }else {
        let sql = "SELECT * FROM Users WHERE email=?";//todo avec le token
        conn.query(sql, [data.email], function (error, results, fields) {
            if (error) throw error;
            if (empty(results)) {
                res.render('index');
            } else {
                res.render('profil', {
                    first_name: data.first_name,
                    last_name: data.last_name,
                    username: data.username,
                    connected: true,
                    //todo age: age,
                    //todo sex: sex,
                    //todo orientation: orientation,
                    //todo bio: bio,
                    //todo tags: tags,
                });
            }
        });
    }
};


module.exports = profil;