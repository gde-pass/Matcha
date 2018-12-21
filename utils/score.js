let conn = require('../database/database');
let jwtUtils = require("./jwt.utils");
let replace = require("str-replace");
let get_user = require("./get_user");

function score(req, res) {
    let data = jwtUtils.getUserID(req.cookies.token);
    if (data.type < 0 || data.type !== "login" || data.email < 0) {
        console.log("You must be logged in to access this site")
        res.render('login')
    } else {
        let url = req.url;
        let target_username = replace.all("/score?").from(url).with("");
        let etoiles = req.body.etoile;
        let sql = "SELECT user_id FROM Users WHERE username = ?";
        conn.query(sql, target_username, function (err, resu) {
            if (err) console.log("error de score1");
            else {
                let target_id = resu[0].user_id;
                let sql = "UPDATE score SET score = ?, user_that_is_scored = ? WHERE current_user_id = ?"
                conn.query(sql, [etoiles, target_id, data.Id], function (err, result) {
                    if (err) console.log("error de score");
                    else {
                        get_user(req, res, true, target_username)
                    }
                })
            }
        })

    }
}

module.exports = score;