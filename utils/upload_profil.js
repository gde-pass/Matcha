const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
let jwtUtils = require("./jwt.utils");
const fs = require('fs');
const glob = require('glob');
let conn = require('../database/database');
const util = require("util");

var file_name;
function up(req,res,file) {
    let data = jwtUtils.getUserID(req.cookies.token);
    // glob(`*/assets/img/${data.username}${data.Id}profil*`,{"ignore":[` ${data.username}${data.Id} + 'profil' + ${path.extname(file.originalname.toString())}`]}, function(err, files) {
    //     var fileName = path.basename(files.toString());
    // if(fileName) {
    //     fs.unlinkSync(`./public/assets/img/${fileName}`);
    // }
    // })
    if (data.email < 0) {
        res.render('profil');
    }
    if (data.type < 0 || data.type != "login") {
        res.render('profil');
    }
    else {
        const storage = multer.diskStorage({
            destination: './public/assets/img/',
            filename: function (req, file, callback) {
                callback(null,  data.Id + 'profil' + path.extname(file.originalname))//todo faire en sorte que le nom de limage sois relier a 'ID de la personne pour que l'on puisse la retrouver
                // callback(null, data.username + data.Id + 'profil' +'-' + Date.now() + path.extname(file.originalname))//todo faire en sorte que le nom de limage sois relier a 'ID de la personne pour que l'on puisse la retrouver
                file_name = data.Id + 'profil' + path.extname(file.originalname);
            }
        });

        const upload = multer({
            storage: storage,
            limits: {fileSize: 1000000},
            fileFilter: function (req, file, callback) {
                checkFileType(file, callback);
            }
        }).single('upload'); // on peut mettre "Array()" pour uploade plusieur image

        function checkFileType(file, callback) {
            const fileTypes = /jpeg|jpg|png/;
            const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
            const mimeType = fileTypes.test(file.mimetype);
            //function pour supprimer l'image de profil precedente
            glob(`*/assets/img/${data.Id}profil*`,{"ignore":[`public/assets/img/${data.Id}profil${path.extname(file.originalname)}`]}, function(err, files) {
                var fileName = path.basename(files.toString());
                if (fileName) {
                    fs.unlinkSync(`./public/assets/img/${fileName}`);
                }
            });

            if (mimeType && extName) {
                return callback(null, true);
            } else {
                callback('Error: images Only!');
            }
        }

        upload(req, res, (err) => {
            if (err) {
                res.send(err); //todo trouver comment envoyer se message a l'HTML
            }
            else {
                if (req.file == undefined) {
                    // res.render('profil',{
                    //     msg: 'Error: No file selected'
                    // });
                    res.send('Error: No file selected'); //todo trouver comment envoyer se message a l'HTML
                } else {
                    let sql = "UPDATE `Settings` SET `profil_img` = ? WHERE `user_id` = ?;";
                    conn.query = util.promisify(conn.query);
                    conn.query(sql, [file_name, data.Id]);
                    res.redirect("profil");
                }
            }
        })
    }
}
module.exports = up;