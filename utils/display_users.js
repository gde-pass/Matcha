"use strict"
let conn = require('../database/database');
const geolib = require('geolib');
let jwtUtils = require("./jwt.utils");
let sortDistance = require("./sort_distance")

let userLat;
let userLng;
let distanceVoulu;
let gender;
let orientation;
let tags;
let age;
let ageMin;
let ageMax;
let isFull = true;
let found_user = null;

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

async function findIfBloqued(req, res, my_Id,users){
    let filtered;
    filtered = await users.filter(async elem => {
        let sql = "SELECT bloqued_by FROM users_bloquer WHERE user_id =?"
        await conn.query(sql,elem.user_id , async function (errors, results) {
            if (errors) return (res.status(500).send(error.sqlMessage));
            else{
                let bloqued_id = results[0].bloqued_by.split(',');
                await bloqued_id.forEach(value => {
                     if(parseInt(value) == my_Id) {
                         found_user = elem;
                         return (true)
                     }else return (false)
                })
            }
        })
    })
    if(found_user != null) {
         filtered = await users.filter(elem => {
            if (elem.user_id == found_user.user_id) {
                return (false);
            }
            else
                return (true)
        })
        return (filtered);
    }else{
        return (users);
    }
}
function display_users(req, res, connected) {

    let data = jwtUtils.getUserID(req.cookies.token);
    if (data.type < 0 || data.type !== "login" || data.email < 0) {
        console.log("You must be logged in to access this site");
        res.render('login')
    } else {
        let sql = "SELECT * FROM Users JOIN Settings ON Users.user_id = Settings.user_id";
        conn.query(sql, function (errors, results, fields) {
            if (errors) return (res.status(500).send(error.sqlMessage));
            for (let k = 0; k < results.length; k++) {
                if (results[k].email == data.email) {
                    if (results[k].orientation != null && results[k].gender != null)
                        isFull = false;
                }
            }
            if (isFull != true) {
                for (let i = 0; i < results.length; i++) {
                    if (results[i].email == data.email) {
                        userLat = results[i].latitude;
                        userLng = results[i].longitude;
                        distanceVoulu = results[i].distance;
                        gender = results[i].gender;
                        orientation = results[i].orientation;
                        ageMin = results[i].ageRangeMin;
                        ageMax = results[i].ageRangeMax;
                        if (results[i].tags != null)
                            tags = results[i].tags.split('#');
                        else
                            tags = [];
                        age = results[i].age;
                    }
                }

                let users = results.filter(res => {
                    if (res.email == data.email)
                        return (false);
                    let dist = geolib.getDistance(
                        {latitude: userLat, longitude: userLng},
                        {latitude: res.latitude, longitude: res.longitude}, 100);
                    if (orientation == 'Homosexual') {
                        if ((dist / 1000) < distanceVoulu && res.age >= ageMin && res.age <= ageMax && gender == res.gender && orientation == res.orientation) {
                            return (true);
                        }
                    } else if (orientation == 'Bisexual') {
                        if ((dist / 1000) < distanceVoulu && res.age >= ageMin && res.age <= ageMax) {
                            return (true);
                        }
                    } else {
                        if ((dist / 1000) < distanceVoulu && res.age >= ageMin && res.age <= ageMax && gender != res.gender && orientation == res.orientation) {
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
                            if ((dist / 1000) < distanceVoulu && res.age >= ageMin && res.age <= ageMax && gender == res.gender && orientation == res.orientation && findTag(res.tags.split('#')) == 1) {
                                return (true);
                            }
                        } else if (orientation == 'bisexual') {
                            if ((dist / 1000) < distanceVoulu && res.age >= ageMin && res.age <= ageMax && findTag(res.tags.split('#')) == 1) {
                                return (true);
                            }
                        } else {
                            if ((dist / 1000) < distanceVoulu && res.age >= ageMin && res.age <= ageMax && gender != res.gender && orientation == res.orientation && findTag(res.tags.split('#')) == 1) {
                                return (true);
                            }
                        }
                        if ((dist / 1000) < distanceVoulu && res.age >= ageMin && res.age <= ageMax && gender != res.gender && orientation == res.orientation && findTag(res.tags.split('#')) == 1) {
                            return (true);
                        }
                    }
                });
                sortDistance(userLat, userLng, users, async function (err, sortedByDistance) {
                    if (err) {
                        console.log(err)
                    } else {
                        let users = await findIfBloqued(req, res, data.Id ,sortedByDistance);
                        res.render('index', {
                            connected: connected,
                            sorted: false,
                            users: users,
                            suggestion: suggestion,
                        })
                    }
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