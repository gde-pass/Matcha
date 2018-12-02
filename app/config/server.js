"use strict";

const express = require("express");
const app = express();
app.use(express.static("public"));
const mysql = require("mysql");
const fs = require("fs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const portAPP = 8080;
const hostAPP = "0.0.0.0";

// DATABASE \\
const portSQL = 3306;
const hostSQL = "192.168.99.100";
const pool = mysql.createPool({
    host: hostSQL,
    port: portSQL,
    user: "root",
    password: "password",
    database: "Matcha",
    connectionLimit: 10,
    getConnection: 0,
    acquireTimeout: 10000
});

const initDb = require("./database/init.js");
initDb.dbInitTables(pool, hostSQL, portSQL);
// --------- \\

const io = require("socket.io").listen(app.listen(portAPP, hostAPP, function (err) {
    if (err) throw err;
    console.log("Matcha is running at http://%s:%s !", hostAPP, portAPP);
}));

require("./routes")(app, fs);
require("./socketsIO")(io);

module.exports.pool = pool;


