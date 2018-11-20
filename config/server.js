"use strict";

const express = require('express');
const app = express();
app.use(express.static('public'));
const mysql = require('mysql');
const fs = require('fs');
const portAPP = 8080;

// DATABASE \\

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
init_db.db_init_tables(pool, host, portSQL);

// ------------ \\

const io = require('socket.io').listen(app.listen(portAPP, host, function (err) {
    if (err) throw err;
    console.log("Matcha is running at http://%s:%s !", host, portAPP);
}));

const routes = require('./routes')(app, fs, io);


