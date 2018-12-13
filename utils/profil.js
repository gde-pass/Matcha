"use strict";
let empty = require('is-empty');
let conn = require('../database/database');
let jwtUtils = require("./jwt.utils");
let replace = require("str-replace");
const glob = require('glob');
const path = require('path');

let display_users = require("../utils/display_users");

function profil(req,res){

    let check = jwtUtils.getUserID(req.cookies.token);
    if(check.exp < Date.now() /1000) {
        res.clearCookie("token");
        // display_users(req, res, false);
    }
    let data = jwtUtils.getUserID(req.cookies.token);
    if (data.email < 0) {
        display_users(req, res, false);
    }
    if (data.type < 0 || data.type != "login") {
        display_users(req, res, false);
    }else {
        let sql = "SELECT * FROM Users WHERE email=?";//todo avec le token
        conn.query(sql, [data.email], function (error, results, fields) {
            if (error) throw error;
            if (empty(results)) {
                display_users(req, res, false);
            } else {
                glob(`*/assets/img/${data.username}${data.Id}profil*`, function(err, files_profil) {
                    var profil_img = path.basename(files_profil.toString());
                    if(empty(profil_img))
                        profil_img = 'undefined';
                glob(`*/assets/images/${data.username}${data.Id}img*`, function(err, files_img) {
                    // var gallery_img = path.basename(files.toString());
                    if(empty(files_img))
                        files_img = 'undefined';
                    var images = [];
                    for(let i = 0; i < files_img.length; i++){
                        images.push(replace.all("public").from(files_img[i]).with(""));
                    }
                    res.render('profil', {
                        first_name: data.first_name,
                        last_name: data.last_name,
                        username: data.username,
                        Id: data.Id,
                        profil_img : profil_img,
                        files_img : images,
                        connected: true,
                        //todo age: age,
                        //todo sex: sex,
                        //todo orientation: orientation,
                        //todo bio: bio,
                        //todo tags: tags,
                    });
                });
                });
            }
        });
    }
};


module.exports = profil;