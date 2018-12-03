"use strict";

function dbInitTableUser(pool) {

    const sql = "CREATE TABLE IF NOT EXISTS Users (" +
        "  `user_id` INT UNSIGNED  NOT NULL AUTO_INCREMENT," +
        "  `email` VARCHAR(254) NOT NULL," +
        "  `first_name` VARCHAR(255) NOT NULL," +
        "  `last_name` VARCHAR(255) NOT NULL," +
        "  `display_name` VARCHAR(15) NOT NULL," +
        "  `password` VARCHAR(60) NOT NULL," +
        "  `checked` BOOLEAN NOT NULL DEFAULT FALSE," +
        "  PRIMARY KEY (user_id)," +
        "  UNIQUE INDEX (email)" +
        ") ENGINE = InnoDB;";

    pool.query(sql, function (err) {
        if (err) throw err;
    });
}


function dbInitTables(pool, hostSQL, portSQL) {

    pool.query("SELECT 1", function (err) {
        if (err) throw err;
        console.log("Connected to the server mysql at http://%s:%s !", hostSQL, portSQL);

        dbInitTableUser(pool);
    });
}

module.exports = {
    dbInitTables: dbInitTables
};