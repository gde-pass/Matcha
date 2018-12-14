"use strict"
let conn = require('../database/database');
const geolib = require('geolib');
const distance = require("../utils/distance");
let jwtUtils = require("./jwt.utils");

let userLat;
let userLng;
let distanceVoulu

function display_users(req, res, connected) {
    let data = jwtUtils.getUserID(req.cookies.token);
    if (data.type < 0 || data.type !== "login" || data.email < 0) {
        display_users(req, res, false);
    } else {
        let sql = "SELECT * FROM Users JOIN Settings ON Users.user_id = Settings.user_id";
        conn.query(sql, function (errors, results, fields) {
            if (errors) throw errors;
            for (let i = 0; i < results.length; i++) {
                if (results[i].email == data.email) {
                    userLat = results[i].latitude;
                    userLng = results[i].longitude;
                    distanceVoulu = results[i].distance;
                }
            }
            let users = results.filter(res => {
                if (res.email == data.email)
                    return (false);
                let dist = geolib.getDistance(
                    {latitude: userLat, longitude: userLng},
                    {latitude: res.latitude, longitude: res.longitude}, 100);
                return ((dist / 1000) < distanceVoulu);
            });

            res.render('index', {
                connected: connected,
                users: users,
            })
        })
    }
}
module.exports = display_users;