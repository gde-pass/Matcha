"use strict";

const express = require('express');
const fs = require('fs');
const mysql = require("mysql");

const app = express();
const portAPP = 8080;
const portSQL = 3306;
const host = "127.0.0.1";

const pool = mysql.createPool({
    host: host,
    port: portSQL,
    user: "root",
    password: "password",
    database: "Matcha",
    connectionLimit: 10,
    getConnection: 0,
    acquireTimeout: 10000
});

const init_db = require('./database/init.js');

const io = require('socket.io').listen(app.listen(portAPP, host, function (err) {
    if (err) throw err;
    console.log("Matcha is running at http://%s:%s", host, portAPP);
}));

init_db.db_init_tables(pool, host, portSQL);

app.get('/', function (req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
    res.write(fs.readFileSync("../app/public/views/index.html"));
    res.end();
});

module.exports = {
    app:    app,
    pool:    pool,
    io:     io
};