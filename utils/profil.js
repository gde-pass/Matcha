"use strict";
let empty = require("is-empty");
let conn = require("../database/database");
let jwtUtils = require("./jwt.utils");
let replace = require("str-replace");
const glob = require("glob");
const path = require("path");

let display_users = require("../utils/display_users");
let users_that_liked_you = [];
let users_that_have_visited_your_profil = [];

function profil(req, res) {
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
            let sql = "SELECT * FROM Users JOIN Settings ON Users.user_id = Settings.user_id WHERE `email` = ?;";//todo avec le token
            conn.query(sql, [data.email], function (error, results) {
                if (error) return (res.send(error.sqlMessage));
                if (empty(results)) {
                    display_users(req, res, false);
                } else {
                    glob(`*/assets/img/${data.Id}profil*`, function (err, files_profil) {
                        let profil_img = path.basename(files_profil.toString());
                        if (empty(profil_img))
                            profil_img = 'undefined';
                        glob(`*/assets/images/${data.Id}img*`, function (err, files_img) {
                            if (empty(files_img))
                                files_img = "";
                            let images = [];
                            for (let i = 0; i < files_img.length; i++) {
                                images.push(replace.all("public").from(files_img[i]).with(""));
                            }
                            let sql = "SELECT * FROM matchs WHERE user1_id = ?";
                            conn.query(sql, data.Id, function (err, resu) {
                                if (error) return (res.send(err.sqlMessage));
                                else {
                                    users_that_liked_you = (resu[0].users_that_liked_you.split(','));
                                    users_that_liked_you.shift();

                                    let sql = "SELECT * FROM Users JOIN Settings ON Users.user_id = Settings.user_id";
                                    conn.query(sql, function (err, resu) {
                                        if (err) return (res.send(err.sqlMessage));
                                        else {
                                            users = resu.filter(usr => {
                                                let check = false;
                                                users_that_liked_you.forEach(liked => {
                                                    if (usr.user_id === parseInt(liked)) {
                                                        check = true
                                                    }
                                                });
                                                return (check)
                                            });
                                            let sql = "SELECT * FROM `Visites` WHERE `username` = ?";
                                            conn.query(sql, [results[0].username], function (err, resu) {
                                                if (error) return (res.send(err.sqlMessage));
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
                                                    longitude: results[0].longitude,
                                                    latitude: results[0].latitude,
                                                    ageRangeMax: results[0].ageRangeMax,
                                                    ageRangeMin: results[0].ageRangeMin,
                                                    connected: true,
                                                    profil_img: profil_img,
                                                    files_img: images,
                                                    users_that_liked_you: users,
                                                    users_that_have_visited_your_profil: resu
                                                });
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