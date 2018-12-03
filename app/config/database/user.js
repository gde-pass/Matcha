"use strict";

const db = require("../server.js");
const bcrypt = require("bcrypt-nodejs");


function dbInsertNewUser(newUser) {
    let sql = "INSERT INTO `Users` (`email`, `display_name`, `password`) VALUES (?, ?, ?);";
    let hash = bcrypt.hashSync(newUser.password);
    db.pool.query(sql, [newUser.email, newUser.user, hash], function (err) {
        if (err) throw err;
    });
}

module.exports = {
  dbInsertNewUser: dbInsertNewUser,
};