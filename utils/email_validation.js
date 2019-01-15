let jwtUtils = require("../utils/jwt.utils");
const empty = require("is-empty");
let conn = require("../database/database");
let display_users = require("../utils/display_users");

function email_validation(req, res, token) {
    let data = jwtUtils.getUserID(token);

    if (data.email < 0) {
        res.render('validation', {
            error: "Token is not valid"
        })
    }
    else if (data.type < 0 || data.type !== "validation") {
        res.render('validation', {
            error: "Token is not valid"
        })
    }else {
        let sqlCheck = 'SELECT * FROM Users WHERE email=?';
        conn.query(sqlCheck, [data.email], function (error, results, fields) {
            if (error)  return (res.send(error.sqlMessage));
            else if (empty(results)) {
                res.render('validation', {
                    error: "There are no users for ths Token"
                })
            }
            else if (results[0].checked === 1) {
                res.render('validation', {
                    success: "Your account is already activated"
                })
            } else {
                let sqlValidate = 'UPDATE Users SET checked=? WHERE email=?';
                conn.query(sqlValidate, [1, data.email], function (error, results, fields) {
                    if (error) return (res.send(error.sqlMessage));
                    else if (empty(results)) {
                        res.render('validation', {
                            error: "There are no users for ths Token"
                        })
                    } else {
                        res.render('validation', {
                            success: "Your account has been activated"
                        })
                    }
                })
            }
        });
    }
}

module.exports = email_validation;