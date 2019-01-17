
let conn = require('../database/database');
const geolib = require('geolib');
let jwtUtils = require("./jwt.utils");
let sortDistance = require("./sort_distance")
let empty = require('is-empty');
var global = require("global")

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
let usersSorted = [];
let suggestionSorted = [];
function findTag(tagVoulu) {
    let found = 0;
    tags.forEach(function (elem) {
        for (let i = 1; i < tagVoulu.length; i++) {
            if (elem.trim().toLowerCase() == tagVoulu[i].trim().toLowerCase()) {
                found = 1;
            }
        }
    });
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
function display_users(req, res, connected) {
    isFull = true;
    let data = jwtUtils.getUserID(req.cookies.token);
    if (data.type < 0 || data.type !== "login" || data.email < 0) {
        res.redirect('/login')
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
                        if ((dist / 1000) < distanceVoulu && res.age >= ageMin && res.age <= ageMax && gender == res.gender && 'Heterosexual' != res.orientation) {
                            return (true);
                        }
                    } else if (orientation == 'Bisexual') {
                        if ((dist / 1000) < distanceVoulu && res.age >= ageMin && res.age <= ageMax) {
                            return (true);
                        }
                    } else {
                        if ((dist / 1000) < distanceVoulu && res.age >= ageMin && res.age <= ageMax && gender != res.gender && 'Homosexual' != res.orientation) {
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
                            if ((dist / 1000) < distanceVoulu && res.age >= ageMin && res.age <= ageMax && gender == res.gender && 'Heterosexual' != res.orientation && findTag(res.tags.split('#')) == 1) {
                                return (true);
                            }
                        } else if (orientation == 'Bisexual') {
                            if ((dist / 1000) < distanceVoulu && res.age >= ageMin && res.age <= ageMax && findTag(res.tags.split('#')) == 1) {
                                return (true);
                            }
                        } else {
                            if ((dist / 1000) < distanceVoulu && res.age >= ageMin && res.age <= ageMax && gender != res.gender && orientation == res.orientation && findTag(res.tags.split('#')) == 1) {
                                return (true);
                            }
                        }
                        if ((dist / 1000) < distanceVoulu && res.age >= ageMin && res.age <= ageMax && gender != res.gender && 'Homosexual' != res.orientation && findTag(res.tags.split('#')) == 1) {
                            return (true);
                        }
                    }
                });

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
                            sortDistance(userLat, userLng, usersSorted, async function (err, sortedByDistance) {
                                if (err) {
                                    // console.log(err)
                                } else {
                                    sortDistance(userLat, userLng, suggestionSorted, async function (err, suggestionDistance) {
                                        if (err) {
                                            // console.log(err)
                                        } else {
                                            if (empty(suggestionDistance)) suggestionDistance = 0;
                                            if (empty(sortedByDistance)) sortedByDistance = 0;
                                            res.render('index', {
                                                connected: connected,
                                                sorted: false,
                                                users: sortedByDistance,
                                                suggestion: suggestionDistance,
                                            })
                                        }
                                    })
                                }
                            })
                        });
                    }
                });
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