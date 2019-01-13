"use strict";
let empty = require('is-empty');
let conn = require('../database/database');
let jwtUtils = require("./jwt.utils");
let replace = require("str-replace");
const glob = require('glob');
const path = require('path');

function chat(req,res){
    let bloquer = 0;
    let data = jwtUtils.getUserID(req.cookies.token);
    if (data.type < 0 || data.type !== "login" || data.email < 0) {
        res.redirect("/");
    } else {
        let url = req.url;
        url = replace.all("/chat?").from(url).with("");
        let sql = "SELECT * FROM Users WHERE `username` = ?";
        conn.query(sql, [url], function (error, results, fields) {
            if (error) return (res.status(500).send(error.sqlMessage));
            if (empty(results)) {
                res.redirect('/');
            } else {
                let reqsql = "SELECT * FROM users_bloquer WHERE user_id=? AND is_bloqued=?";
                conn.query(reqsql,[results[0].user_id, data.Id], function (error, results2, fields) {
                    if (error) return (res.status(500).send(error.sqlMessage));
                            if(!empty(results2)){
                                bloquer = 1;
                            }
                        glob(`*/assets/img/${data.username}${data.Id}profil*`, function(err, files_profil) {
                            var profil_img = path.basename(files_profil.toString());
                            if(empty(profil_img))
                                profil_img = 'undefined';
                            let sql2 = "SELECT username FROM Users LEFT JOIN matchs ON Users.user_id = REPLACE(matchs.users_you_liked, ',', '') WHERE matchs.user1_id =? AND matchs.users_you_liked = matchs.users_that_liked_you";
                            conn.query(sql2,[data.Id], function (error, results, fields) {
                                if (error) return (res.status(500).send(error.sqlMessage));
                                let friend = results;
                            res.render('chat', {
                                first_name: data.first_name,
                                last_name: data.last_name,
                                username: data.username,
                                Id: data.Id,
                                profil_img : profil_img,
                                connected: true,
                                friend: friend,
                                link: url,
                                bloquer: bloquer
                            });
                            })
                        });
                });
            }
        });
    }
};


module.exports = chat;
