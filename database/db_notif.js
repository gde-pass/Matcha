"use strict";
const db = require("./database");
const util = require("util");

function CreateNotif(socket, data, niu) {
    let cnotif = "INSERT INTO Notifications (from_user_id, from_username, to_user_id, type, unread, date_n) VALUES( ?, ?, ?, ?, ?, NOW())";
    db.query(cnotif, [socket.data.user_id, socket.data.username, niu, data.type, 1], function (error) {
        // if (error)throw error;
    });
    return (true);
};

function CreateNotifMatch(socket, data, niu) {
    let cnotif = "INSERT INTO Notifications (from_user_id, from_username, to_user_id, type, unread, date_n) VALUES( ?, ?, ?, ?, ?, NOW())";
    db.query(cnotif, [niu, data.user, socket.data.user_id, data.type, 1], function (error) {
        // if (error)throw error;
    });
    return (true);
};

async function AlreadyNotif(socket, data, niu){
    let sqlnotif = "SELECT * FROM Notifications WHERE from_user_id=? AND to_user_id=? AND type=?";
    db.query = util.promisify(db.query);
    try {
        let result = await db.query(sqlnotif,[socket.data.user_id, niu, data.type]);
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
    CreateNotif: CreateNotif,
    CreateNotifMatch: CreateNotifMatch,
    AlreadyNotif: AlreadyNotif
};
