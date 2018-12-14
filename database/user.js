"use strict";

const bcrypt = require("bcrypt-nodejs");
const db = require("./database");
const util = require("util");
const jwtUtils = require("../utils/jwt.utils");

async function dbPasswordUpdate(password, id) {

    let sql = "UPDATE `Users` SET `password` = ? WHERE `user_id` = ?;";
    let hash = bcrypt.hashSync(password);
    db.query = util.promisify(db.query);

    try {
        await db.query(sql, [hash, id]);
    } catch (error) {
        throw error;
    }
}

async function dbAgeUpdate(age, id) {

    let sql = "UPDATE `Users` SET `age` = ? WHERE `user_id` = ?;";
    db.query = util.promisify(db.query);

    try {
        await db.query(sql, [age, id]);
    } catch (error) {
        throw error;
    }
}

async function dbDistanceUpdate(distance, id) {

    let sql = "UPDATE `Users` SET `distance` = ? WHERE `user_id` = ?;";
    db.query = util.promisify(db.query);

    try {
        await db.query(sql, [distance, id]);
    } catch (error) {
        throw error;
    }
}

async function dbTagsUpdate(tags, id) {

    let sql = "UPDATE `Users` SET `tags` = ? WHERE `user_id` = ?;";
    db.query = util.promisify(db.query);

    try {
        await db.query(sql, [tags, id]);
    } catch (error) {
        throw error;
    }
}

async function dbBioUpdate(bio, id) {

    let sql = "UPDATE `Users` SET `bio` = ? WHERE `user_id` = ?;";
    db.query = util.promisify(db.query);

    try {
        await db.query(sql, [bio, id]);
    } catch (error) {
        throw error;
    }
}

async function dbSexUpdate(sex, id) {

    let sql = "UPDATE `Users` SET `sex` = ? WHERE `user_id` = ?;";
    db.query = util.promisify(db.query);

    try {
        await db.query(sql, [sex, id]);
    } catch (error) {
        throw error;
    }
}

async function dbOrientationUpdate(orientation, id) {

    let sql = "UPDATE `Users` SET `orientation` = ? WHERE `user_id` = ?;";
    db.query = util.promisify(db.query);

    try {
        await db.query(sql, [orientation, id]);
    } catch (error) {
        throw error;
    }
}

async function dbEmailUpdate(email, id) {

    let sql = "UPDATE `Users` SET `email` = ? WHERE `user_id` = ?;";
    db.query = util.promisify(db.query);

    try {
        await db.query(sql, [email, id]);
    } catch (error) {
        throw error;
    }
}

async function dbUsernameUpdate(username, id) {

    let sql = "UPDATE `Users` SET `username` = ? WHERE `user_id` = ?;";
    db.query = util.promisify(db.query);

    try {
        await db.query(sql, [username, id]);
    } catch (error) {
        throw error;
    }
}

async function dbLastNameUpdate(last_name, id) {

    let sql = "UPDATE `Users` SET `last_name` = ? WHERE `user_id` = ?;";
    db.query = util.promisify(db.query);

    try {
        await db.query(sql, [last_name, id]);
    } catch (error) {
        throw error;
    }
}

async function dbFirstNameUpdate(first_name, id) {

    let sql = "UPDATE `Users` SET `first_name` = ? WHERE `user_id` = ?;";
    db.query = util.promisify(db.query);

    try {
        await db.query(sql, [first_name, id])
    } catch (error) {
        throw error;
    }
}


async function dbSettingsUpdate(data) {

    let id = await dbSelectIdUserByMail(jwtUtils.getUserID(data.cookie).email);

    if (data.first_name.length !== 0) {
        await dbFirstNameUpdate(data.first_name, id);
    } else if (data.last_name.length !== 0) {
        await dbLastNameUpdate(data.last_name, id);
    } else if (data.username.length !== 0) {
        await dbUsernameUpdate(data.username, id);
    } else if (data.email.length !== 0) {
        await dbEmailUpdate(data.email, id);
    } else if (data.orientation.length !== 0) {
        await dbOrientationUpdate(data.orientation, id);
    } else if (data.sex.length !== 0) {
        await dbSexUpdate(data.sex, id);
    } else if (data.bio.length !== 0) {
        await dbBioUpdate(data.bio, id);
    } else if (data.tags.length !== 0) {
        await dbTagsUpdate(data.tags, id);
    } else if (data.distance.length !== 0) {
        await dbDistanceUpdate(data.distance, id);
    } else if (data.age.length !== 0) {
        await dbAgeUpdate(data.age, id);
    } else if (data.password.length !== 0) {
        await dbPasswordUpdate(data.password, id);
    }
}


async function dbSelectIdUserByMail(email) {

    let sql = "SELECT `user_id` FROM `Users` WHERE `email` = ?;";
    db.query = util.promisify(db.query);

    try {
        let result = await db.query(sql, [email]);
        return (result[0].user_id);
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
    dbSettingsUpdate: dbSettingsUpdate,
};