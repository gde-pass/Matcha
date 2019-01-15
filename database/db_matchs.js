"use strict";
const db = require("./database");
const util = require("util");

async function WasMatch(socket, niu){
    let sqlnotif = "SELECT * FROM matchs WHERE user1_id=? AND users_that_liked_you=?";
    db.query = util.promisify(db.query);
    try {
        let result = await db.query(sqlnotif,[socket.data.user_id, niu]);
        if (result.length == 0) {
            return (false);
        } else {
            return (true);
        }
    } catch (error) {
        // throw error;
    }
};

async function IsMatch(socket, niu){
    let sqlnotif = "SELECT * FROM matchs WHERE user1_id=? AND users_you_liked=? AND users_you_liked = users_that_liked_you";
    db.query = util.promisify(db.query);
    try {
        let result = await db.query(sqlnotif,[socket.data.user_id, niu]);
        // console.log('RES MATCH OR NOT :' ,result);
        if (result.length == 0) {
            return (false);
        } else {
            return (true);
        }
    } catch (error) {
        // throw error;
    }
};

module.exports = {
    WasMatch: WasMatch,
    IsMatch: IsMatch
};
