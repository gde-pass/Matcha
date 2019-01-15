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
        "  `score` int(5) DEFAULT 0," +
        "  PRIMARY KEY (user_id)," +
        "  UNIQUE INDEX (email)," +
        "  UNIQUE INDEX (username)" +
        ") ENGINE = InnoDB;";
    conn.query = util.promisify(conn.query);
    try {
        await conn.query(sql);
    } catch (error) {
        // throw error;
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
        "    `profil_img` VARCHAR(256) DEFAULT 0," +
        "    PRIMARY KEY(user_id)," +
        "    FOREIGN KEY(user_id) REFERENCES Users(user_id)" +
        ") ENGINE = InnoDB;";

    conn.query = util.promisify(conn.query);
    try {
        await conn.query(sql);
    } catch (error) {
        // throw error;
    }
}

async function dbInitTableVisites(conn) {

    const sql = "CREATE TABLE IF NOT EXISTS Visites (" +
        "    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT," +
        "    `username` VARCHAR(15) NOT NULL," +
        "    `visiteur` VARCHAR(15) NOT NULL," +
        "    `date_visite` TIMESTAMP NOT NULL," +
        "    PRIMARY KEY(id)" +
        ") ENGINE = InnoDB;";

    conn.query = util.promisify(conn.query);
    try {
        await conn.query(sql);
    } catch (error) {
        // throw error;
    }
}

async function dbInitTableMatch(conn) {

    const sql = "CREATE TABLE IF NOT EXISTS matchs (" +
        "    `user1_id` INT UNSIGNED NOT NULL," +
        "    `users_you_liked` varchar(100) not null," +
        "    `users_that_liked_you` varchar(100) not null," +
        "    FOREIGN KEY(user1_id) REFERENCES Users(user_id)" +
        ") ENGINE = InnoDB;";

    conn.query = util.promisify(conn.query);
    try {
        await conn.query(sql);
    } catch (error) {
        // throw error;
    }
}

async function dbInitTableScore(conn) {

    const sql = "CREATE TABLE IF NOT EXISTS score (" +
        "    `current_user_id` INT UNSIGNED NOT NULL," +
        "    `score` int(11) not null," +
        "    `user_that_is_scored` int(11) not null," +
        "    FOREIGN KEY(current_user_id) REFERENCES Users(user_id)" +
        ") ENGINE = InnoDB;";

    conn.query = util.promisify(conn.query);
    try {
        await conn.query(sql);
    } catch (error) {
        // throw error;
    }
}

async function dbInitTableBloquer(conn) {

    const sql = "CREATE TABLE IF NOT EXISTS users_bloquer (" +
        "    `user_id` INT UNSIGNED NOT NULL," +
        "    `is_bloqued` int(1) DEFAULT 0," +
        "    `bloqued_by` varchar(256) not null," +
        "    FOREIGN KEY(user_id) REFERENCES Users(user_id)" +
        ") ENGINE = InnoDB;";

    conn.query = util.promisify(conn.query);
    try {
        await conn.query(sql);
    } catch (error) {
        // throw error;
    }
}
async function dbInitTableListBloquer(conn) {

    const sql = "CREATE TABLE IF NOT EXISTS list_bloquer (" +
        "    `user_id` INT(10) UNSIGNED NOT NULL," +
        "    `is_bloqued` int(11) DEFAULT 0," +
        "    FOREIGN KEY(user_id) REFERENCES Users(user_id)" +
        ") ENGINE = InnoDB;";

    conn.query = util.promisify(conn.query);
    try {
        await conn.query(sql);
    } catch (error) {
        // throw error;
    }
}
function dbInitTableUseronline(conn) {

    const sql3 = "CREATE TABLE IF NOT EXISTS Useronline (" +
        "    `user_id` INT UNSIGNED NOT NULL ," +
        "    `username` VARCHAR(15) NOT NULL," +
        "    `online` ENUM ('N','Y')," +
        "    `socketid` VARCHAR(255)," +
        "    `in_conv` INT," +
        "    `last_connection` DATETIME," +
        "    PRIMARY KEY(user_id)," +
        "    FOREIGN KEY(user_id) REFERENCES Users(user_id)" +
        ") ENGINE = InnoDB;";

    conn.query(sql3, function (err) {
        // if (err) throw err;
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
        // if (err) throw err;
    });
}


function dbInitTableNotifications(conn) {

    const sql5 = "CREATE TABLE IF NOT EXISTS Notifications (" +
        "    `notif_id` INT UNSIGNED NOT NULL AUTO_INCREMENT," +
        "    `from_user_id` INT ," +
        "    `from_username` VARCHAR(15) ," +
        "    `to_user_id` INT," +
        "    `type` INT," +
        "    `unread` INT," +
        "    `date_n` DATETIME," +
        "    PRIMARY KEY(notif_id)" +
        ") ENGINE = InnoDB;";

    conn.query(sql5, function (err) {
        // if (err) throw err;
    });
}
async function dbInitTableReports(conn) {
    const sql = "CREATE TABLE IF NOT EXISTS Reports (" +
        "    `report_id` INT UNSIGNED NOT NULL AUTO_INCREMENT," +
        "    `reported` VARCHAR(15) NOT NULL," +
        "    `reporter` VARCHAR(15) NOT NULL," +
        "    PRIMARY KEY(report_id)" +
        ") ENGINE = InnoDB;";

    conn.query = util.promisify(conn.query);
    try {
        await conn.query(sql);
    } catch (error) {
        // throw error;
    }
}

async function dbInitTables(conn, hostSQL, portSQL) {

    conn.query("SELECT 1", async function (err) {
        // if (err) throw err;
        console.log("Connected to the server mysql at http://%s:%s !", hostSQL, portSQL);

       await dbInitTableUser(conn);
       await dbInitTableSettings(conn);
       dbInitTableUseronline(conn);
       dbInitTableMessages(conn);
       await dbInitTableMatch(conn);
       await dbInitTableScore(conn);
       dbInitTableNotifications(conn);
       await dbInitTableBloquer(conn);
       await dbInitTableReports(conn);
       await dbInitTableVisites(conn);
       await dbInitTableListBloquer(conn);
    });
}

module.exports = {
    dbInitTables: dbInitTables
};
