let empty = require('is-empty');
let conn = require('../database/database');
let jwtUtils = require("./jwt.utils");

function distance(distance, token){
    let data = jwtUtils.getUserID(token);
    if (data.email < 0) {
        // res.render('index');
        //console.log("fail email")
    }
    if (data.type < 0 || data.type != "login") {
        // res.render('index');
        // console.log("fail login")
    }else {
        let sql = "SELECT * FROM Users WHERE email=?";//todo avec le token
        conn.query(sql, [data.email], function (error, results, fields) {
            if (error)  return (res.send(error.sqlMessage));
            if (empty(results)) {
                // console.log('erreur probleme dans distance.js');
                // res.render('index');
            } else {
                let multiplieur = distance / 5;
                let value = 0.04191;
                let disToAdd = value * multiplieur;
                let lat = results[0].latitude;
                let lng = results[0].longitude;
                let maxLatNorth = lat + disToAdd;
                let maxLatSouth = lat - disToAdd;
                let maxLngWest = lng - disToAdd;
                let maxLngEst = lng + disToAdd;
                // let perimetre ={
                //     latMax: maxLatNorth,
                //     latMin: maxLatSouth,
                //     lgnMax: maxLngEst,
                //     lgnMin: maxLngWest
                // }
                // return (perimetre);
            };
            })
        };
    }
module.exports = distance;