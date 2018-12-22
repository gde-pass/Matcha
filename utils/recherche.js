"use strict"
let conn = require('../database/database');
const geolib = require('geolib');
let jwtUtils = require("./jwt.utils");
let sortAge = require("./sort_age")
let sortDistance = require("./sort_distance")
let sortScore = require("./sort_score")
let empty = require('is-empty');


let userLat;
let userLng;
let distanceVoulu;
let gender;
let orientation;
let score;
let tags;
let isFull = true;
let sort = "age";

function findTag(tag, tagVoulu) {
    let found = 0;

    if (!empty(tag)) {
        tag.split('#').forEach(function (elem) {
            for (let i = 1; i < tagVoulu.length; i++) {
                if (elem.trim() == tagVoulu[i].trim()) {
                    found = 1;
                }
            }
        });
        if (found == 0) {
            tag.split(' ').forEach(function (elem) {
                for (let i = 1; i < tagVoulu.length; i++) {
                    if (elem.trim() == tagVoulu[i].trim()) {
                        found = 1;
                    }
                }
            });
        }
    }
    return (found);
}

function recherche(req, res) {
    let ageBox = req.body.ageBox;
    let age1 = req.body.age1;
    let age2 = req.body.age2;
    let distanceBox = req.body.distanceBox;
    let distance1 = req.body.distance1;
    let distance2 = req.body.distance2;
    let scoreBox = req.body.scoreBox;
    let score1 = req.body.score1;
    let score2 = req.body.score2;
    let tag = req.body.tag;
    console.log(age1)
    // if(age1 < 18) age1 = 18;
    // if(age1 > 100) age1 = 100;
    let data = jwtUtils.getUserID(req.cookies.token);
    if (data.type < 0 || data.type !== "login" || data.email < 0) {
        //todo error handling
        console.log('error')
    } else {
        let sql = "SELECT * FROM Users JOIN Settings ON Users.user_id = Settings.user_id";
        conn.query(sql, function (errors, results, fields) {
            if (errors) throw errors;
            for (let k = 0; k < results.length; k++) {
                if (results[k].email == data.email) {
                    if (results[k].orientation != null && results[k].sex != null)
                        isFull = false;
                }
            }
            if (isFull != true && age1 != "undefined") {
                for (let i = 0; i < results.length; i++) {
                    if (results[i].email == data.email) {
                        userLat = results[i].latitude;
                        userLng = results[i].longitude;
                        gender = results[i].sex;
                        orientation = results[i].orientation;
                        score = results[i].score;
                        if (results[i].tags != null)
                            tags = results[i].tags.split('#');
                        else
                            tags = [];
                    }
                }

                let users = results.filter(res => {
                    if (res.email == data.email)
                        return (false);
                    let dist = geolib.getDistance(
                        {latitude: userLat, longitude: userLng},
                        {latitude: res.latitude, longitude: res.longitude}, 100);
                    if (orientation == 'Homosexual') {
                        if ((dist / 1000) >= distance1 && (dist / 1000) <= distance2 && res.age >= age1 && res.age <= age2 && gender == res.sex && orientation == res.orientation && res.score >= score1 && res.score <= score2) {
                            return (true);
                        }
                    } else if (orientation == 'Bisexual') {
                        if ((dist / 1000) >= distance1 && (dist / 1000) <= distance2 && res.age >= age1 && res.age <= age2 && res.score >= score1 && res.score <= score2) {
                            return (true);
                        }
                    } else {
                        if ((dist / 1000) >= distance1 && (dist / 1000) <= distance2 && res.age >= age1 && res.age <= age2 && gender != res.sex && orientation == res.orientation && res.score >= score1 && res.score <= score2) {
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
                            if ((dist / 1000) >= distance1 && (dist / 1000) <= distance2 && res.age >= age1 && res.age <= age2 && gender == res.sex && orientation == res.orientation && findTag(tag, res.tags.split('#')) == 1 && res.score >= score1 && res.score <= score2) {
                                return (true);
                            }
                        } else if (orientation == 'bisexual') {
                            if ((dist / 1000) >= distance1 && (dist / 1000) <= distance2 && res.age >= age1 && res.age <= age2 && findTag(tag, res.tags.split('#')) == 1 && res.score >= score1 && res.score <= score2) {
                                return (true);
                            }
                        } else {
                            if ((dist / 1000) < distanceVoulu && gender != res.sex && orientation == res.orientation && findTag(tag, res.tags.split('#')) == 1 && res.score >= score1 && res.score <= score2) {
                                return (true);
                            }
                        }
                        if ((dist / 1000) >= distance1 && (dist / 1000) <= distance2 && res.age >= age1 && res.age <= age2 && gender != res.sex && orientation == res.orientation && findTag(tag, res.tags.split('#')) == 1 && res.score >= score1 && res.score <= score2) {
                            return (true);
                        }
                    }
                });
                if (ageBox == 1) {
                    sortAge(req, res, users, function (err, sortedByAge) {
                        if (err) {
                            //error handling
                        } else {
                            res.render('recherche', {
                                // connected: connected,
                                sorted: true,
                                ageChecked: "checked",
                                users: sortedByAge,
                                suggestion: suggestion,
                                tag: tag,
                                age1: age1,
                                age2: age2,
                                distance1: distance1,
                                distance2: distance2,
                                score1: score1,
                                score2: score2
                            })
                        }
                    })
                } else if (distanceBox == 1) {
                    sortDistance(userLat, userLng, users, function (err, sortedByDistance) {
                        if (err) {
                            //error handling
                        } else {
                            res.render('recherche', {
                                // connected: connected,
                                sorted: false,
                                distanceChecked: "checked",
                                users: sortedByDistance,
                                suggestion: suggestion,
                                tag: tag,
                                age1: age1,
                                age2: age2,
                                distance1: distance1,
                                distance2: distance2,
                                score1: score1,
                                score2: score2
                            })
                        }
                    })
                } else if (scoreBox == 1) {
                    sortScore(req, res, users, function (err, sortedScore) {
                        if (err) {
                            //error handling
                        } else {
                            res.render('recherche', {
                                // connected: connected,
                                sorted: true,
                                scoreChecked: "checked",
                                users: sortedScore,
                                suggestion: suggestion,
                                tag: tag,
                                age1: age1,
                                age2: age2,
                                distance1: distance1,
                                distance2: distance2,
                                score1: score1,
                                score2: score2
                            })
                        }
                    })
                }
                else {
                    sortDistance(userLat, userLng, users, function (err, sortedByDistance) {
                        if (err) {
                            //error handling
                        } else {
                            res.render('recherche', {
                                connected: true,
                                sorted: false,
                                users: sortedByDistance,
                                suggestion: suggestion,
                                tag: tag,
                                age1: age1,
                                age2: age2,
                                distance1: distance1,
                                distance2: distance2,
                                score1: score1,
                                score2: score2
                            })
                        }
                    })
                }

            } else {
                res.render('recherche', {
                    connected: connected,
                    users: 1,
                    suggestion: 1,
                    age1: age1,
                    tag: tag,
                    age2: age2,
                    distance1: distance1,
                    distance2: distance2,
                    score1: score1,
                    score2: score2
                })
            }
        })
    }
}

module.exports = recherche;