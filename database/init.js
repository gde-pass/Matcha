"use strict";
const util = require("util");

async function dbInitTableUser(conn) {

    const sql = "CREATE TABLE IF NOT EXISTS Users (" +
        "  `user_id` INT UNSIGNED  NOT NULL AUTO_INCREMENT," +
        "  `email` VARCHAR(254) NOT NULL," +
        "  `first_name` VARCHAR(40) NOT NULL," +
        "  `last_name` VARCHAR(40) NOT NULL," +
        "  `username` VARCHAR(15) NOT NULL," +
        "  `password` VARCHAR(60) NOT NULL," +
        "  `checked` BOOLEAN NOT NULL DEFAULT FALSE," +
        "  `latitude` real DEFAULT 0," +
        "  `longitude` real DEFAULT 0," +
        "  PRIMARY KEY (user_id)," +
        "  UNIQUE INDEX (email)" +
        ") ENGINE = InnoDB;";
    conn.query = util.promisify(conn.query);
    try {
        await conn.query(sql);
    } catch (error) {
        throw error;
    }
}

async function dbInitTableSettings(conn) {

    const sql = "CREATE TABLE IF NOT EXISTS Settings (" +
        "    `user_id` INT UNSIGNED NOT NULL AUTO_INCREMENT," +
        "    `orientation` VARCHAR(12) DEFAULT 'Bisexual' NOT NULL," +
        "    `gender` VARCHAR (6)," +
        "    `bio` TEXT (500)," +
        "    `tags` VARCHAR(255)," +
        "    `distance` TINYINT UNSIGNED DEFAULT 50 NOT NULL," +
        "    `age` TINYINT UNSIGNED DEFAULT 18 NOT NULL," +
        "    `ageRangeMin` TINYINT UNSIGNED DEFAULT 18 NOT NULL," +
        "    `ageRangeMax` TINYINT UNSIGNED DEFAULT 100 NOT NULL," +
        "    PRIMARY KEY(user_id)," +
        "    FOREIGN KEY(user_id) REFERENCES Users(user_id)" +
        ") ENGINE = InnoDB;";
  
    conn.query = util.promisify(conn.query);
    try {
        await conn.query(sql);
    } catch (error) {
        throw error;
    }
}

function dbInitTableUseronline(conn) {

    const sql3 = "CREATE TABLE IF NOT EXISTS Useronline (" +
        "    `user_id` INT UNSIGNED NOT NULL ," +
        "    `username` VARCHAR(15) NOT NULL," +
        "    `online` ENUM ('N','Y')," +
        "    `socketid` VARCHAR(255)," +
        "    `in_conv` INT," +
        "    PRIMARY KEY(user_id)," +
        "    FOREIGN KEY(user_id) REFERENCES Users(user_id)" +
        ") ENGINE = InnoDB;";

    conn.query(sql3, function (err) {
        if (err) throw err;
    });
}

function dbInitTableMessages(conn) {

    const sql4 = "CREATE TABLE IF NOT EXISTS Messages (" +
        "    `mess_id` INT UNSIGNED NOT NULL AUTO_INCREMENT," +
        "    `from_user_id` INT ," +
        "    `to_user_id` INT," +
        "    `message` TEXT," +
        "    `date` DATETIME," +
        "    PRIMARY KEY(mess_id)" +
        ") ENGINE = InnoDB;";

    conn.query(sql4, function (err) {
        if (err) throw err;
    });
}

async function dbInitTables(conn, hostSQL, portSQL) {

    conn.query("SELECT 1", async function (err) {
        if (err) throw err;
        console.log("Connected to the server mysql at http://%s:%s !", hostSQL, portSQL);

       await dbInitTableUser(conn);
       await dbInitTableSettings(conn);
       dbInitTableUseronline(conn);
       dbInitTableMessages(conn);
    });
}

module.exports = {
    dbInitTables: dbInitTables
};
