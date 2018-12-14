"use strict";
let empty = require('is-empty');
let conn = require('../database/database');
let jwtUtils = require("./jwt.utils");
let replace = require("str-replace");
const glob = require('glob');
const path = require('path');

function chat(req,res){

    let data = jwtUtils.getUserID(req.cookies.token);
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
                    let sql2 = "SELECT * FROM Users WHERE user_id IN (SELECT user_id FROM Useronline WHERE online= ?)";
                    conn.query(sql2,['Y'], function (error, results, fields) {
                        if (error) throw error;
                        let friend = results;
                        // console.log('data friend: ', friend[0]);

                    res.render('chat', {
                        first_name: data.first_name,
                        last_name: data.last_name,
                        username: data.username,
                        Id: data.Id,
                        profil_img : profil_img,
                        files_img : images,
                        connected: true,
                        friend: friend,
                    });
                    })
                });
                });
            }
        });
    }
};


module.exports = chat;
