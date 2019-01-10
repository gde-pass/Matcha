"use strict";
const db = require("./database");
const util = require("util");

async function WasMatch(socket, niu){
    let sqlnotif = "SELECT * FROM matchs WHERE user1_id=? AND users_that_liked_you=?";
    db.query = util.promisify(db.query);
    try {
        let result = await db.query(sqlnotif,[socket.data.user_id, niu]);
        console.log('RES REVOKE :' ,result);
        if (result.length == 0) {
            return (false);
        } else {
            return (true);
        }
    } catch (error) {
        throw error;
    }
};

module.exports = {
    WasMatch: WasMatch,
};
