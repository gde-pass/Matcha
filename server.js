"use strict";
//------IMPORT EXTERNE---------------------------------------------------------------------------------------
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');

//-----IMPORT LOCAL------------------------------------------------------------------------------------------
const index = require('./routes/routes');
const initDb = require("./database/init.js");
const db = require("./database/database");

//------VARIABLE GLOBALE-------------------------------------------------------------------------------------
const app = express();
const portAPP = 8080;
const hostAPP = "0.0.0.0";

initDb.dbInitTables(db, "192.168.99.100", 3306);
//----VIEW ENGINE--------------------------------------------------------------------------------------------
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');

//-----MIDDLE WARE-------------------------------------------------------------------------------------------
app.use(bodyParser.json());
app.use("/assets", express.static('public/assets'));
app.use(bodyParser.urlencoded({ extended: true }));

const io = require("socket.io").listen(app.listen(portAPP, hostAPP, function (err) {
    if (err) throw err;
    console.log("Matcha is running at http://%s:%s !", hostAPP, portAPP);
}));
//-----ROUTE-------------------------------------------------------------------------------------------------
app.use('/', index);
require("./sockets/socketsIO")(io);



