"use strict";

const bcrypt = require("bcrypt-nodejs");
const db = require("./database");
const util = require("util");

async function dbSelectIdUserByMail(email) {

    let sql = "SELECT `user_id` FROM `Users` WHERE `email` = ?;";

    db.query = util.promisify(db.query);
    try {
        let result = await db.query(sql, [email]);
        let id = result[0].user_id;
        return (id);
    } catch (error) {
        throw error;
    }
}

async function dbInitUserDefaultSettings(newUser) {

    let id = await dbSelectIdUserByMail(newUser.email);
    let sql = "INSERT INTO `Settings` (`user_id`) VALUES (?)";

    db.query(sql, [id], function (err) {
        if (err) throw err;
    });
}

async function dbInsertNewUser(newUser) {

    let sql = "INSERT INTO `Users` (`email`,`first_name`,`last_name`, `username`, `password`) VALUES (?, ?, ?, ?, ?);";
    let hash = bcrypt.hashSync(newUser.password);

    db.query = util.promisify(db.query);
    try {
        await db.query(sql, [newUser.email, newUser.first_name, newUser.last_name, newUser.user, hash]);
        await dbInitUserDefaultSettings(newUser);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    dbInsertNewUser: dbInsertNewUser,
};