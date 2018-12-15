"use strict"
let conn = require('../database/database');
const geolib = require('geolib');
const distance = require("../utils/distance");
let jwtUtils = require("./jwt.utils");

let userLat;
let userLng;
let distanceVoulu;
let gender;
let orientation;
let tags;
let age;
let isFull = true;
function display_users(req, res, connected) {
    let data = jwtUtils.getUserID(req.cookies.token);
    if (data.type < 0 || data.type !== "login" || data.email < 0) {
        console.log("You must be logged in to access this site")
        res.render('login')
    } else {
        let sql = "SELECT * FROM Users JOIN Settings ON Users.user_id = Settings.user_id";
        conn.query(sql, function (errors, results, fields) {
            if (errors) throw errors;
            for (let k = 0; k < results.length; k++) {
                if (results[k].email == data.email) {
                    if (results[k].orientation != null)
                        isFull = false;
                }
            }
            if (isFull != true) {
                for (let i = 0; i < results.length; i++) {
                    if (results[i].email == data.email) {
                        userLat = results[i].latitude;
                        userLng = results[i].longitude;
                        distanceVoulu = results[i].distance;
                        gender = results[i].sex;
                        orientation = results[i].orientation;
                        if (results[i].tags != null)
                            tags = results[i].tags.split('#');
                        else
                            tags = [];
                        age = results[i].age;
                    }
                }

                function findTag(tagVoulu) {
                    let found = 0;
                    tags.forEach(function (elem) {
                        for (let i = 1; i < tagVoulu.length; i++) {
                            if (elem.trim() == tagVoulu[i].trim()) {
                                found = 1;
                            }
                        }
                    });
                    return (found);
                }

                let users = results.filter(res => {
                    if (res.email == data.email)
                        return (false);
                    let dist = geolib.getDistance(
                        {latitude: userLat, longitude: userLng},
                        {latitude: res.latitude, longitude: res.longitude}, 100);
                    if (orientation == 'Homosexual') {
                        if ((dist / 1000) < distanceVoulu && gender == res.sex && orientation == res.orientation) {
                            return (true);
                        }
                    } else if (orientation == 'Bisexual') {
                        if ((dist / 1000) < distanceVoulu) {
                            return (true);
                        }
                    } else {
                        if ((dist / 1000) < distanceVoulu && gender != res.sex && orientation == res.orientation) {
                            return (true);
                        }
                    }
                });
                let suggestion = results.filter(res => {
                    if (res.email == data.email)
                        return (false);
                    let dist = geolib.getDistance(
                        {latitude: userLat, longitude: userLng},
                        {latitude: res.latitude, longitude: res.longitude}, 100);
                    if (res.tags != null) {
                        if (orientation == 'Homosexual') {
                            if ((dist / 1000) < distanceVoulu && gender == res.sex && orientation == res.orientation && findTag(res.tags.split('#')) == 1) {
                                return (true);
                            }
                        } else if (orientation == 'bisexual') {
                            if ((dist / 1000) < distanceVoulu && findTag(res.tags.split('#')) == 1) {
                                return (true);
                            }
                        } else {
                            if ((dist / 1000) < distanceVoulu && gender != res.sex && orientation == res.orientation && findTag(res.tags.split('#')) == 1) {
                                return (true);
                            }
                        }
                        if ((dist / 1000) < distanceVoulu && gender != res.sex && orientation == res.orientation && findTag(res.tags.split('#')) == 1) {
                            return (true);
                        }
                    }
                });
                res.render('index', {
                    connected: connected,
                    users: users,
                    suggestion: suggestion
                })
            } else {
                res.render('index', {
                    connected: connected,
                    users: 1,
                    suggestion: 1
                })
            }
        })
    }
}
module.exports = display_users;