"use strict";
let empty = require('is-empty');
let conn = require('../database/database');
let jwtUtils = require("./jwt.utils");

function profil(req,res){

    let email = jwtUtils.getUserID(req.cookies.token);

    if (email < 0) {
        res.render('index');
    }else {
        let sql = "SELECT * FROM Users WHERE email=?";//todo avec le token
        conn.query(sql, [email], function (error, results, fields) {
            if (error) throw error;
            if (empty(results)) {
                res.render('index');
            } else {
                res.render('profil', {
                    first_name: results[0].first_name,
                    last_name: results[0].last_name,
                    username: results[0].display_name,
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