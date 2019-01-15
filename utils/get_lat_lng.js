"use strict";
let conn = require('../database/database');
let jwtUtils = require("./jwt.utils");

let userLat;
let userLng;

function findUserLocation(req) {
    let data = jwtUtils.getUserID(req.cookies.token);
    if (data.type < 0 || data.type !== "login" || data.email < 0) {
        display_users(req, res, false);
    } else {
        let sqlUser = "SELECT * FROM Users WHERE email = ?";
        conn.query = (sqlUser, data.email, function (error, res) {
            if (error)  return (res.send(error.sqlMessage));
            userLat = res[0].latitude;
            userLng = res[0].longitude;
        })
    }
}

module.exports = findUserLocation;