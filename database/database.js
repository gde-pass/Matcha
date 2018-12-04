const mysql = require("mysql");

const portSQL = 3306;
const hostSQL = "192.168.99.100";
const connection = mysql.createPool({
    host: hostSQL,
    port: portSQL,
    user: "root",
    password: "password",
    database: "Matcha",
    connectionLimit: 10,
    getConnection: 0,
    acquireTimeout: 10000
});

module.exports = connection;