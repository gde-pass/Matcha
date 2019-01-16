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
let usersSorted = [];
let suggestionSorted = [];
function findTag(tag, tagVoulu) {
    let found = 0;
    if (!empty(tag)) {
        tag.split('#').forEach(function (elem) {
            for (let i = 1; i < tagVoulu.length; i++) {
                if (elem.trim().toLowerCase() == tagVoulu[i].trim().toLowerCase()) {
                    found = 1;
                }
            }
        });
        if (found == 0) {
            tag.split(' ').forEach(function (elem) {
                for (let i = 1; i < tagVoulu.length; i++) {
                    if (elem.trim().toLowerCase() == tagVoulu[i].trim().toLowerCase()) {
                        found = 1;
                    }
                }
            });
        }
    }
    return (found);
}

function findIfBloqued(req, res, my_Id, users, cb){
    let sql = "SELECT * FROM users_bloquer WHERE user_id =?";
    conn.query(sql, my_Id, function(err, results){
        if (err) conosle.log(err);
        else if(!empty(results)){
            cb(null,results)
        }else{
            cb(null,users)
        }
    })
}

function recherche(req, res, connected) {
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
    let data = jwtUtils.getUserID(req.cookies.token);
    if (data.type < 0 || data.type !== "login" || data.email < 0) {
        //console.log('error dans: recherche.js')
    } else {
        let sql = "SELECT * FROM Users JOIN Settings ON Users.user_id = Settings.user_id";
        conn.query(sql, function (errors, results, fields) {
            if (errors) return (res.send(errors.sqlMessage));
            for (let k = 0; k < results.length; k++) {
                if (results[k].email == data.email) {
                    if (results[k].orientation != null && results[k].gender != null)
                        isFull = false;
                }
            }
            if (isFull != true && age1 != "undefined") {
                for (let i = 0; i < results.length; i++) {
                    if (results[i].email == data.email) {
                        userLat = results[i].latitude;
                        userLng = results[i].longitude;
                        gender = results[i].gender;
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
                        if ((dist / 1000) >= distance1 && (dist / 1000) <= distance2 && res.age >= age1 && res.age <= age2 && gender == res.gender && 'Heterosexual' != res.orientation && res.score >= score1 && res.score <= score2) {
                            return (true);
                        }
                    } else if (orientation == 'Bisexual') {
                        if ((dist / 1000) >= distance1 && (dist / 1000) <= distance2 && res.age >= age1 && res.age <= age2 && res.score >= score1 && res.score <= score2) {
                            return (true);
                        }
                    } else {
                        if ((dist / 1000) >= distance1 && (dist / 1000) <= distance2 && res.age >= age1 && res.age <= age2 && gender != res.gender && 'Homosexual' != res.orientation && res.score >= score1 && res.score <= score2) {
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
                            if ((dist / 1000) >= distance1 && (dist / 1000) <= distance2 && res.age >= age1 && res.age <= age2 && gender == res.gender && 'Heterosexual' != res.orientation && findTag(tag, res.tags.split('#')) == 1 && res.score >= score1 && res.score <= score2) {
                                return (true);
                            }
                        } else if (orientation == 'Bisexual') {
                            if ((dist / 1000) >= distance1 && (dist / 1000) <= distance2 && res.age >= age1 && res.age <= age2 && findTag(tag, res.tags.split('#')) == 1 && res.score >= score1 && res.score <= score2) {
                                return (true);
                            }
                        } else {
                            if ((dist / 1000) < distanceVoulu && gender != res.gender && 'Homosexual' != res.orientation && findTag(tag, res.tags.split('#')) == 1 && res.score >= score1 && res.score <= score2) {
                                return (true);
                            }
                        }
                        if ((dist / 1000) >= distance1 && (dist / 1000) <= distance2 && res.age >= age1 && res.age <= age2 && gender != res.gender && orientation == res.orientation && findTag(tag, res.tags.split('#')) == 1 && res.score >= score1 && res.score <= score2) {
                            return (true);
                        }
                    }
                });
                if (ageBox == 1) {
                    findIfBloqued(req, res, data.Id, users, function (err, listOfBloqued) {
                        if (err) {
                            // console.log(err)
                        } else {
                            let found = 0;
                            usersSorted = users.filter(value => {
                                found = 0;
                                for (let j = 0; j < listOfBloqued.length; j++) {
                                    if (value.user_id == listOfBloqued[j].is_bloqued) found = 1;
                                }
                                if (found == 1) return false;
                                else if (found == 0) return true;
                            });
                            if (!empty(suggestion)) {
                                findIfBloqued(req, res, data.Id, suggestion, function (err, listOfBloqued) {
                                    if (err) {
                                        // console.log(err)
                                    } else {
                                        suggestionSorted = suggestion.filter(value => {
                                            found = 0;
                                            for (let j = 0; j < listOfBloqued.length; j++) {
                                                if (value.user_id == listOfBloqued[j].is_bloqued) found = 1;
                                            }
                                            if (found == 1) return false;
                                            else if (found == 0) return true;
                                        });
                                    }
                                });
                            }
                            sortAge(req, res, usersSorted, function (err, sortedByAge) {
                                if (err) {
                                    // console.log(err)
                                } else {
                                    sortAge(req, res, suggestionSorted, function (err, suggestionAge) {
                                        if (err) {
                                            // console.log(err)
                                        } else {
                                            if (empty(suggestionAge)) suggestionAge = 0;
                                            if (empty(sortedByAge)) sortedByAge = 0;
                                            res.render('recherche', {
                                                connected: connected,
                                                sorted: true,
                                                ageChecked: "checked",
                                                users: sortedByAge,
                                                suggestion: suggestionAge,
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
                            })
                        }
                    });
                } else if (distanceBox == 1) {
                    findIfBloqued(req, res, data.Id, users, function (err, listOfBloqued) {
                        if (err) {
                            // console.log(err)
                        } else {
                            let found = 0;
                            usersSorted = users.filter(value => {
                                found = 0;
                                for (let j = 0; j < listOfBloqued.length; j++) {
                                    if (value.user_id == listOfBloqued[j].is_bloqued) found = 1;
                                }
                                if (found == 1) return false;
                                else if (found == 0) return true;
                            });
                            if (!empty(suggestion)) {
                                findIfBloqued(req, res, data.Id, suggestion, function (err, listOfBloqued) {
                                    if (err) {
                                        // console.log(err)
                                    } else {
                                        suggestionSorted = suggestion.filter(value => {
                                            found = 0;
                                            for (let j = 0; j < listOfBloqued.length; j++) {
                                                if (value.user_id == listOfBloqued[j].is_bloqued) found = 1;
                                            }
                                            if (found == 1) return false;
                                            else if (found == 0) return true;
                                        });
                                    }
                                });
                            }
                            sortDistance(userLat, userLng, usersSorted, function (err, sortedByDistance) {
                                if (err) {
                                    // console.log(err)
                                } else {
                                    sortDistance(userLat, userLng, suggestionSorted, function (err, suggestionDistance) {
                                        if (err) {
                                            // console.log(err)
                                        } else {
                                            if (empty(suggestionDistance)) suggestionDistance = 0;
                                            if (empty(sortedByDistance)) sortedByDistance = 0;
                                            res.render('recherche', {
                                                connected: connected,
                                                sorted: false,
                                                distanceChecked: "checked",
                                                users: sortedByDistance,
                                                suggestion: suggestionDistance,
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
                            })
                        }
                    });
                } else if (scoreBox == 1) {
                    findIfBloqued(req, res, data.Id, users, function (err, listOfBloqued) {
                        if (err) {
                            // console.log(err)
                        } else {
                            let found = 0;
                            usersSorted = users.filter(value => {
                                found = 0;
                                for (let j = 0; j < listOfBloqued.length; j++) {
                                    if (value.user_id == listOfBloqued[j].is_bloqued) found = 1;
                                }
                                if (found == 1) return false;
                                else if (found == 0) return true;
                            });
                            if (!empty(suggestion)) {
                                findIfBloqued(req, res, data.Id, suggestion, function (err, listOfBloqued) {
                                    if (err) {
                                        // console.log(err)
                                    } else {
                                        suggestionSorted = suggestion.filter(value => {
                                            found = 0;
                                            for (let j = 0; j < listOfBloqued.length; j++) {
                                                if (value.user_id == listOfBloqued[j].is_bloqued) found = 1;
                                            }
                                            if (found == 1) return false;
                                            else if (found == 0) return true;
                                        });
                                    }
                                });
                            }
                            sortScore(req, res, usersSorted, function (err, sortedScore) {
                                if (err) {
                                    // console.log(err)
                                } else {
                                    sortScore(req, res, suggestionSorted, function (err, suggestionScore) {
                                        if (err) {
                                            // console.log(err)
                                        } else {
                                            if (empty(suggestionScore)) suggestionScore = 0;
                                            if (empty(sortedScore)) sortedScore = 0;
                                            res.render('recherche', {
                                                connected: connected,
                                                sorted: true,
                                                scoreChecked: "checked",
                                                users: sortedScore,
                                                suggestion: suggestionScore,
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
                            })
                        }
                    });
                } else {
                    findIfBloqued(req, res, data.Id, users, function (err, listOfBloqued) {
                        if (err) {
                            // console.log(err)
                        } else {
                            let found = 0;
                            usersSorted = users.filter(value => {
                                found = 0;
                                for (let j = 0; j < listOfBloqued.length; j++) {
                                    if (value.user_id == listOfBloqued[j].is_bloqued) found = 1;
                                }
                                if (found == 1) return false;
                                else if (found == 0) return true;
                            });
                            if (!empty(suggestion)) {
                                findIfBloqued(req, res, data.Id, suggestion, function (err, listOfBloqued) {
                                    if (err) {
                                        // console.log(err)
                                    } else {
                                        suggestionSorted = suggestion.filter(value => {
                                            found = 0;
                                            for (let j = 0; j < listOfBloqued.length; j++) {
                                                if (value.user_id == listOfBloqued[j].is_bloqued) found = 1;
                                            }
                                            if (found == 1) return false;
                                            else if (found == 0) return true;
                                        });
                                    }
                                });
                            }
                            sortDistance(userLat, userLng, usersSorted, function (err, sortedByDistance) {
                                if (err) {
                                    // console.log(err)
                                } else {
                                    sortDistance(userLat, userLng, suggestionSorted, function (err, suggestionDistance) {
                                        if (err) {
                                            // console.log(err)
                                        } else {
                                            if (empty(suggestionDistance)) suggestionDistance = 0;
                                            if (empty(sortedByDistance)) sortedByDistance = 0;
                                            res.render('recherche', {
                                                connected: true,
                                                sorted: false,
                                                users: sortedByDistance,
                                                suggestion: suggestionDistance,
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
                            })
                        }
                    });
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