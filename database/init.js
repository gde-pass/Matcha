"use strict";

function dbInitTableUser(conn) {

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

    conn.query(sql, function (err) {
        if (err) throw err;
    });
}

function dbInitTableSettings(conn) {

    const sql = "CREATE TABLE IF NOT EXISTS Settings (" +
        "    `user_id` INT UNSIGNED NOT NULL AUTO_INCREMENT," +
        "    `orientation` CHAR(2)," +
        "    `sex` VARCHAR (1)," +
        "    `bio` TEXT (500)," +
        "    `tags` VARCHAR(255)," +
        "    `distance` TINYINT UNSIGNED," +
        "    `age` TINYINT UNSIGNED," +
        "    PRIMARY KEY(user_id)," +
        "    FOREIGN KEY(user_id) REFERENCES Users(user_id)" +
        ") ENGINE = InnoDB;";

    conn.query(sql, function (err) {
        if (err) throw err;
    });
}

function dbInitTables(conn, hostSQL, portSQL) {

    conn.query("SELECT 1", function (err) {
        if (err) throw err;
        console.log("Connected to the server mysql at http://%s:%s !", hostSQL, portSQL);

        dbInitTableUser(conn);
        dbInitTableSettings(conn);
    });
}

module.exports = {
    dbInitTables: dbInitTables
};