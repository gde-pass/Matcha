"use strict";

const bcrypt = require("bcrypt-nodejs");
const db = require("./database");
const util = require("util");
const jwtUtils = require("../utils/jwt.utils");
const empty = require("is-empty");

async function dbPasswordUpdate(password, id) {

    let sql = "UPDATE `Users` SET `password` = ? WHERE `user_id` = ?;";
    let hash = bcrypt.hashSync(password);
    db.query = util.promisify(db.query);

    try {
        await db.query(sql, [hash, id]);
    } catch (error) {
        // throw error;
    }
}

async function dbAgeRangeMinUpdate(ageRangeMin, id) {

    let sql = "UPDATE `Settings` SET `ageRangeMin` = ? WHERE `user_id` = ?;";
    db.query = util.promisify(db.query);

    try {
        await db.query(sql, [ageRangeMin, id]);
    } catch (error) {
        // throw error;
    }
}

async function dbAgeRangeMaxUpdate(ageRangeMax, id) {

    let sql = "UPDATE `Settings` SET `ageRangeMax` = ? WHERE `user_id` = ?;";
    db.query = util.promisify(db.query);

    try {
        await db.query(sql, [ageRangeMax, id]);
    } catch (error) {
        // throw error;
    }
}

async function dbAgeUpdate(age, id) {

    let sql = "UPDATE `Settings` SET `age` = ? WHERE `user_id` = ?;";
    db.query = util.promisify(db.query);

    try {
        await db.query(sql, [age, id]);
    } catch (error) {
        // throw error;
    }
}

async function dbDistanceUpdate(distance, id) {

    let sql = "UPDATE `Settings` SET `distance` = ? WHERE `user_id` = ?;";
    db.query = util.promisify(db.query);

    try {
        await db.query(sql, [distance, id]);
    } catch (error) {
        // throw error;
    }
}

async function dbTagsUpdate(tags, id) {

    let sql = "UPDATE `Settings` SET `tags` = ? WHERE `user_id` = ?;";
    db.query = util.promisify(db.query);

    try {
        await db.query(sql, [tags, id]);
    } catch (error) {
        // throw error;
    }
}

async function dbBioUpdate(bio, id) {

    let sql = "UPDATE `Settings` SET `bio` = ? WHERE `user_id` = ?;";
    db.query = util.promisify(db.query);

    try {
        await db.query(sql, [bio, id]);
    } catch (error) {
        // throw error;
    }
}

async function dbGenderUpdate(gender, id) {

    let sql = "UPDATE `Settings` SET `gender` = ? WHERE `user_id` = ?;";
    db.query = util.promisify(db.query);

    try {
        await db.query(sql, [gender, id]);
    } catch (error) {
        // throw error;
    }
}

async function dbOrientationUpdate(orientation, id) {

    let sql = "UPDATE `Settings` SET `orientation` = ? WHERE `user_id` = ?;";
    db.query = util.promisify(db.query);

    try {
        await db.query(sql, [orientation, id]);
    } catch (error) {
        // throw error;
    }
}

async function dbEmailUpdate(email, id) {

    let sql = "UPDATE `Users` SET `email` = ? WHERE `user_id` = ?;";
    db.query = util.promisify(db.query);

    try {
        await db.query(sql, [email, id]);
    } catch (error) {
        // throw error;
    }
}

async function dbUsernameUpdate(username, id) {

    let sql = "UPDATE `Users` SET `username` = ? WHERE `user_id` = ?;";
    db.query = util.promisify(db.query);

    try {
        await db.query(sql, [username, id]);
    } catch (error) {
        // throw error;
    }
}

async function dbLastNameUpdate(last_name, id) {

    let sql = "UPDATE `Users` SET `last_name` = ? WHERE `user_id` = ?;";
    db.query = util.promisify(db.query);

    try {
        await db.query(sql, [last_name, id]);
    } catch (error) {
        // throw error;
    }
}

async function dbFirstNameUpdate(first_name, id) {

    let sql = "UPDATE `Users` SET `first_name` = ? WHERE `user_id` = ?;";
    db.query = util.promisify(db.query);

    try {
        await db.query(sql, [first_name, id])
    } catch (error) {
        // throw error;
    }
}

async function dbLongitudeUpdate(longitude, id) {

    let sql = "UPDATE `Users` SET `longitude` = ? WHERE `user_id` = ?;";
    db.query = util.promisify(db.query);

    try {
        await db.query(sql, [longitude, id])
    } catch (error) {
        // throw error;
    }
}

async function dbLatitudeUpdate(latitude, id) {

    let sql = "UPDATE `Users` SET `latitude` = ? WHERE `user_id` = ?;";
    db.query = util.promisify(db.query);

    try {
        await db.query(sql, [latitude, id])
    } catch (error) {
        // throw error;
    }
}


async function dbSettingsUpdate(data) {
    let id = await dbSelectIdUserByMail(jwtUtils.getUserID(data.cookie).email);

    if (data.first_name.length !== 0) {
        await dbFirstNameUpdate(data.first_name, id);
    }
    if (data.last_name.length !== 0) {
        await dbLastNameUpdate(data.last_name, id);
    }
    if (data.username.length !== 0) {
        await dbUsernameUpdate(data.username, id);
    }
    if (data.email.length !== 0) {
        await dbEmailUpdate(data.email, id);
    }
    if (data.orientation.length !== 0) {
        await dbOrientationUpdate(data.orientation, id);
    }
    if (data.gender.length !== 0) {
        await dbGenderUpdate(data.gender, id);
    }
    if (data.bio.length !== 0) {
        await dbBioUpdate(data.bio, id);
    }
    if (data.tags.length !== 0) {
        await dbTagsUpdate(data.tags, id);
    }
    if (data.distance.length !== 0) {
        await dbDistanceUpdate(data.distance, id);
    }
    if (data.age.length !== 0) {
        await dbAgeUpdate(data.age, id);
    }
    if (data.password.length !== 0) {
        await dbPasswordUpdate(data.password, id);
    }
    if (data.ageRangeMin.length !== 0) {
        await dbAgeRangeMinUpdate(data.ageRangeMin, id);
    }
    if (data.ageRangeMax.length !== 0) {
        await dbAgeRangeMaxUpdate(data.ageRangeMax, id);
    }
    if (data.longitude.length !== 0) {
        await dbLongitudeUpdate(data.longitude, id);
    }
    if (data.latitude.length !== 0) {
        await dbLatitudeUpdate(data.latitude, id);
    }
}


async function dbSelectIdUserByMail(email) {

    let sql = "SELECT `user_id` FROM `Users` WHERE `email` = ?;";
    db.query = util.promisify(db.query);

    try {
        let result = await db.query(sql, [email]);
        return (result[0].user_id);
    } catch (error) {
        // throw error;
    }
}

async function dbSelectIdUserByUsername(username) {
    if(username !== undefined && !empty(username)) {
      let sql = "SELECT `user_id` FROM `Users` WHERE `username` = ?";
      db.query = util.promisify(db.query);
      try {
          let result = await db.query(sql,[username]);
      if (result.length == 0) {
              return (false);
          } else {
              return (result[0].user_id);
          }
      } catch (error) {
      }
  }else {
      return (false);
  }
};

async function dbInitUserDefaultSettings(newUser) {

    let id = await dbSelectIdUserByMail(newUser.email);
    let sql = "INSERT INTO `Settings` (`user_id`) VALUES (?)";

    db.query(sql, [id], function (err) {
        // if (err) throw err;
    });

    let sqlmatch = "INSERT INTO `matchs` (`user1_id`) VALUES (?)";

    db.query(sqlmatch, [id], function (err) {
        // if (err) throw err;
    });

    let sqlscore = "INSERT INTO `score` (`current_user_id`) VALUES (?)";

    db.query(sqlscore, [id], function (err) {
        // if (err) throw err;
    });

    let sqlbloque = "INSERT INTO `list_bloquer` (`user_id`) VALUES (?)";

    db.query(sqlbloque, [id], function (err) {
        // if (err) throw err;
    });

    let sqlbloque2 = "INSERT INTO `users_bloquer` (`user_id`) VALUES (?)";

    db.query(sqlbloque2, [id], function (err) {
        // if (err) throw err;
    });


    let sqlonligne = "INSERT INTO `Useronline` (`user_id`) VALUES (?)";

    db.query(sqlonligne, [id], function (err) {
        // if (err) throw err;
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
        // throw error;
    }
}

async function reportUser(data) {
    if(!empty(data) && data !== undefined && !empty(data.cookie)) {
        let sql = "INSERT INTO `Reports` (`reported`,`reporter`) VALUES (?, ?)";
        let reported = data.reported;
        let reporter = jwtUtils.getUserID(data.cookie).username;

        db.query = util.promisify(db.query);

        try {
            await db.query(sql, [reported, reporter]);
        } catch (error) {
            // throw error;
        }
    }
}

async function visiteUser(data) {
    if(!empty(data) && data !== undefined && !empty(data.username)) {
        let sql = "INSERT INTO `Visites` (`username`,`visiteur`) VALUES (?, ?)";

        let visiteur = jwtUtils.getUserID(data.token).username;

        db.query = util.promisify(db.query);

        try {
            await db.query(sql, [data.username, visiteur]);
        } catch (error) {
            // throw error;
        }
    }
}

async function userBlock(socket, niu){
    let reqsql = "SELECT * FROM users_bloquer WHERE user_id=? AND is_bloqued=?";
    db.query = util.promisify(db.query);
    try {
        let result = await db.query(reqsql,[niu, socket.data.user_id]);
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
    dbInsertNewUser: dbInsertNewUser,
    dbSettingsUpdate: dbSettingsUpdate,
    dbSelectIdUserByUsername: dbSelectIdUserByUsername,
    reportUser: reportUser,
    visiteUser: visiteUser,
    userBlock: userBlock
};
