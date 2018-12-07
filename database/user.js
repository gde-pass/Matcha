"use strict";

const bcrypt = require("bcrypt-nodejs");
const db = require("./database");


function dbInsertNewUser(newUser) {
    let sql = "INSERT INTO `Users` (`email`,`first_name`,`last_name`, `display_name`, `password`) VALUES (?, ?, ?, ?, ?);";
    let hash = bcrypt.hashSync(newUser.password);
    db.query(sql, [newUser.email, newUser.first_name, newUser.last_name,newUser.user, hash], function (err) {
        if (err) throw err;
    });
}

module.exports = {
    dbInsertNewUser: dbInsertNewUser,
};