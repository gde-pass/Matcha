let jwtUtils = require("../utils/jwt.utils");
const empty = require("is-empty");
let conn = require("../database/database");
const bcrypt = require("bcrypt-nodejs");

function reset(token, password) {
    let data = jwtUtils.getUserID(token);
    if (data.email !== 0) {
        // console.log("FAIL")
        // window.location.href = 'http://0.0.0.0:8080/login?token'; //todo rediriger vers la page login avec un message derreur
    }
    else if (data.type < 0 || data.type !== "reset") {
        // console.log("FAIL")
        // window.location.href = 'http://0.0.0.0:8080/login?token';
    } else {
        let sqlCheck = 'SELECT * FROM Users WHERE email=?';
        conn.query(sqlCheck, [data.email], function (error, results) {
            if (error) return (res.send(error.sqlMessage));
            else if (empty(results)) {
                // console.log("FAIL")
                // window.location.href = 'http://0.0.0.0:8080/login?token';//todo rediriger vers la page login avec un message derreur
            } else {
                let hash = bcrypt.hashSync(password);
                let sqlReset = "UPDATE Users SET password=? WHERE email=?";
                conn.query(sqlReset, [hash, data.email], function (error, results) {
                    if (error) return (res.send(error.sqlMessage));
                    else if (empty(results)) {
                        // console.log("FAIL")
                        // window.location.href = 'http://0.0.0.0:8080/login?token';//todo rediriger vers la page login avec un message derreur
                    } else {
                        // console.log("SUCCESS")
                        // window.location.href = 'http://0.0.0.0:8080/login?sucess';//todo rediriger vers la page login avec un message de sucess
                    }
                })
            }
        });
    }
}

module.exports = reset;
