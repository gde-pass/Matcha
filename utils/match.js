"use strict";
let get_user = require("../utils/get_user");
let replace = require("str-replace");
let empty = require('is-empty');
const jwtUtils = require("./jwt.utils");
const util = require("util");
const glob = require('glob');
let conn = require('../database/database');

let user_id;
let matched_id = [];

function match(req, res, connected) {
    let url = req.url;
    url = replace.all("/match?").from(url).with("");

    let data = jwtUtils.getUserID(req.cookies.token);
    if (data.type < 0 || data.type !== "login" || data.email < 0) {
        display_users(req, res, false);
    } else {
        let sql = "SELECT * FROM matchs WHERE user1_id = ?";
        conn.query(sql, data.Id, function (er, resu, fi) {
            if (er) throw er;
            matched_id = resu[0].user2_id.split(',');
            let sql = "SELECT `user_id` FROM `Users` WHERE `email` = ?;";
            conn.query(sql, data.email, function (err, res, fields) {
                if (err) throw err;
                if (!empty(res)) {
                    user_id = res[0].user_id;
                    let sql = "SELECT `user_id` FROM `Users` WHERE `username` = ?;";
                    conn.query(sql, url, function (err, result, fields) {
                        if (err) throw err;
                        if (!empty(result)) {
                            // console.log(matched_id.toString());
                            let alreadyLiked = matched_id.filter(ret => {
                                // console.log(ret.trim()+"||"+result[0].user_id.toString().trim())
                                if (ret.trim() == result[0].user_id.toString().trim())
                                    return (true);
                                else
                                    return (false)
                            })
                            if (alreadyLiked == result[0].user_id) {
                                var filtered = matched_id.filter(function (value,) {

                                    return value != result[0].user_id;

                                });
                                let sql = "UPDATE matchs SET user1_id = ?, user2_id = ?";
                                conn.query(sql, [user_id, filtered.toString()], function (errors, results, fiedls) {
                                    if (errors) throw errors;
                                })
                            } else {
                                matched_id.push(result[0].user_id)
                                let sql = "UPDATE matchs SET user1_id = ?, user2_id = ?";
                                conn.query(sql, [user_id, matched_id.toString()], function (errors, results, fiedls) {
                                    if (errors) throw errors;
                                })
                            }
                        }

                    })
                }
            })
        })
    }
    get_user(req, res, false, url)
}

module.exports = match;