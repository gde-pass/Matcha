"use strict";
//------IMPORT EXTERNE---------------------------------------------------------------------------------------
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const cookieParser = require('cookie-parser');

//-----IMPORT LOCAL------------------------------------------------------------------------------------------
const index = require('./routes/routes');
const initDb = require("./database/init.js");
const db = require("./database/database");
// const profil = require('./utils/profil');
// const upload = require('./utils/upload_profil');
const api = require("./routes/api");

//------VARIABLE GLOBALE-------------------------------------------------------------------------------------
const app = express();
const portAPP = 8080;
const hostAPP = "localhost";

initDb.dbInitTables(db, "192.168.99.100", 3306);
//----VIEW ENGINE--------------------------------------------------------------------------------------------
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');

//-----MIDDLE WARE-------------------------------------------------------------------------------------------
app.use(cookieParser())
app.use(bodyParser.json());
app.use("/assets", express.static('public/assets'));
app.use("/node_modules", express.static('node_modules'));
app.use(bodyParser.urlencoded({ extended: true }));

let options = {
    host: '192.168.99.100',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'Matcha'
};
let sessionStore = new MySQLStore(options);
app.use(session({
    secret: 'secret',
    saveUninitialized :  false,
    resave: false,
    store: sessionStore
    // cookie: {secure: true}
}));

const io = require("socket.io").listen(app.listen(portAPP, hostAPP, function (err) {
    if (err) throw err;
    console.log("Matcha is running at http://%s:%s !", hostAPP, portAPP);
}));
//-----ROUTE-------------------------------------------------------------------------------------------------
app.use('/api', api);
app.use('/', index);
app.use(function (req, res) {
    res.render("404");
});
// app.use('/profil', profil);
// app.use('/upload', upload);
require("./sockets/socketsIO")(io);