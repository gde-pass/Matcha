"use strict";

const express = require('express');
const app = express();
const fs = require('fs');
const port = 8080;

const io = require('socket.io').listen(app.listen(port));

app.get('/', function (req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
    res.write(fs.readFileSync("../app/public/views/index.html"));
    res.end();
});

app.use(express.static(__dirname + '/app/public'));
console.log("Matcha is running at http://localhost:" + port);

io.sockets.on("connection", function (socket) {


})
