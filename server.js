"use strict";

const express = require('express');
const fs = require('fs');
const mysql = require("mysql");

const app = express();
const portAPP = 8080;
const portSQL = 3306;
const host = "127.0.0.1";

const con = mysql.createConnection({
    host: host,
    port: portSQL,
    user: "root",
    password: "",
    //database: ""
});

// con.connect(function (err) {
//     if (err) throw err;
//     console.log("Connected to the server mysql at %s:%s !", host, portSQL);
// });

const io = require('socket.io').listen(app.listen(portAPP, host, function (err) {
    if (err) throw err;
    console.log("Matcha is running at http://%s:%s", host, portAPP);
}));

app.get('/', function (req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
    res.write(fs.readFileSync("../app/public/views/index.html"));
    res.end();
});


io.sockets.on("connection", function (socket) {


});
