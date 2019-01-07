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
        usersDistances.push({
            dist: geolib.getDistance({latitude: userLat, longitude: userLng}, {
                latitude: usersLat[i],
                longitude: usersLng[i]
            }, 100) / 1000,
            index: i
        });
    }

    usersDistances.sort(function (a, b) {
        return a.dist - b.dist
    });

    try {
        for (let i = 0; i < usersDistances.length; i++)
            tabUsers.push(users[usersDistances[i].index]);
    } catch (error) {
        cb(error, users);
    }
    cb(undefined, tabUsers);

}

module.exports = sortDistance;