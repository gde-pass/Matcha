let conn = require('../database/database');
const geolib = require('geolib');


async function sortDistance(userLat, userLng, users, cb) {
    let usersLat = [];
    let usersLng = [];
    let tabUsers = [];
    let usersDistances = [];
    users.forEach(function (elem) {
        usersLat.push(elem.latitude);
        usersLng.push(elem.longitude);
    })
    for (let i = 0; i < users.length; i++) {
        usersDistances.push(geolib.getDistance(
            {latitude: userLat, longitude: userLng},
            {latitude: usersLat[i], longitude: usersLng[i]}, 100) / 1000);
    }

    usersDistances.sort(function (a, b) {
        return a - b
    });

    let sql = "SELECT * FROM Users JOIN Settings ON Users.user_id = Settings.user_id";
    try {
        let result = await conn.query(sql);
        let i = 0;
        let j;
        while (i < usersDistances.length) {
            j = 0;
            while (j < result.length) {
                let dist = geolib.getDistance(
                    {latitude: userLat, longitude: userLng},
                    {latitude: result[j].latitude, longitude: result[j].longitude}, 100) / 1000;
                if (dist == usersDistances[i]) {
                    tabUsers.push(result[j])
                }
                j++;
            }
            i++;
        }
        // let caca;
        // console.log(caca = geolib.getDistance(
        //     {latitude: userLat, longitude: userLng},
        //     {latitude:50.876219588034665, longitude: 0.005752969960212795}, 100)/1000)
    } catch (error) {
        throw error;
    }
    cb(null, tabUsers);
}

module.exports = sortDistance;