"use strict";
let empty = require('is-empty');
let conn = require('../database/database');
let jwtUtils = require("./jwt.utils");
let replace = require("str-replace");
const glob = require('glob');
const path = require('path');

let display_users = require("../utils/display_users");
let users_that_liked_you = [];


function profil(req,res){
    let users = [];
    let check = jwtUtils.getUserID(req.cookies.token);
    if (check.exp < Date.now() / 1000) {
        res.clearCookie("token");
        display_users(req, res, false);
    } else {
        let data = jwtUtils.getUserID(req.cookies.token);
        if (data.type < 0 || data.type !== "login" || data.email < 0) {
            display_users(req, res, false);
        } else {
            let sql = "SELECT * FROM Users JOIN Settings ON Users.user_id = Settings.user_id WHERE `email` = ?";//todo avec le token
            conn.query(sql, [data.email], function (error, results) {
                if (error) return (res.status(500).end());
                if (empty(results)) {
                    display_users(req, res, false);
                } else {
                    glob(`*/assets/img/${data.username}${data.Id}profil*`, function (err, files_profil) {
                        var profil_img = path.basename(files_profil.toString());
                        if (empty(profil_img))
                            profil_img = 'undefined';
                        glob(`*/assets/images/${data.username}${data.Id}img*`, function (err, files_img) {
                            if (empty(files_img))
                                files_img = "";
                            var images = [];
                            for (let i = 0; i < files_img.length; i++) {
                                images.push(replace.all("public").from(files_img[i]).with(""));
                            }
                            let sql = "SELECT * FROM matchs WHERE user1_id = ?";
                            conn.query(sql, data.Id, function (err, resu) {
                                if (error) return (res.status(500).end());
                                else {
                                    users_that_liked_you = (resu[0].users_that_liked_you.split(','))
                                    users_that_liked_you.shift();

                                    let sql = "SELECT * FROM Users JOIN Settings ON Users.user_id = Settings.user_id";
                                    conn.query(sql, function (err, resu) {
                                        if (err) return (res.status(500).end());
                                        else {
                                            users = resu.filter(usr => {
                                                let check = false
                                                users_that_liked_you.forEach(liked => {
                                                    if (usr.user_id == parseInt(liked)) {
                                                        check = true
                                                    }
                                                })
                                                return (check)
                                            })
                                            res.render('profil', {
                                                first_name: results[0].first_name,
                                                last_name: results[0].last_name,
                                                username: results[0].username,
                                                email: results[0].email,
                                                age: results[0].age,
                                                sex: results[0].gender,
                                                orientation: results[0].orientation,
                                                bio: results[0].bio,
                                                tags: results[0].tags,
                                                distance: results[0].distance,
                                                connected: true,
                                                profil_img: profil_img,
                                                files_img: images,
                                                users_that_liked_you: users
                                            });
                                        }
                                    })
                                }
                            })
                        });
                    });
                }
            });
        }
    }
}

module.exports = profil;