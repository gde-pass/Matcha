let conn = require('../database/database');
let jwtUtils = require("./jwt.utils");
let replace = require("str-replace");
let get_user = require("./get_user");

function findScore(user, cb) {
    let tabscore = [];
    let sql = "SELECT score FROM score WHERE user_that_is_scored = ?";
    conn.query(sql, user, function (err, resu) {
        if (err) return (res.send(err.sqlMessage));
        else {
            resu.forEach(function (elem) {
                tabscore.push(elem.score)
            });
            var sum = tabscore.reduce(add, 0);

            function add(a, b) {
                return a + b;
            }
            cb(null, sum / tabscore.length)
        }
    })
}

let scor = 0;
function score(req, res) {
    let data = jwtUtils.getUserID(req.cookies.token);
    if (data.type < 0 || data.type !== "login" || data.email < 0) {
        // console.log("You must be logged in to access this site")
        res.render('login')
    } else {
        let url = req.url;
        let target_username = replace.all("/score?").from(url).with("");
        let etoiles = req.body.etoile;
        let sql = "SELECT user_id FROM Users WHERE username = ?";
        conn.query(sql, target_username, function (err, resu) {
            if (err) return (res.send(err.sqlMessage));
            else {
                let target_id = resu[0].user_id;
                let sql = "UPDATE score SET score = ?, user_that_is_scored = ? WHERE current_user_id = ?";
                conn.query(sql, [etoiles, target_id, data.Id], function (err, result) {
                    if (err) return (res.send(err.sqlMessage));
                    else {
                        findScore(target_id, function (err, sumScore) {
                            if (isNaN(sumScore))
                                scor = 0;
                            else
                                scor = sumScore;
                            let sql = "UPDATE Users SET score = ? WHERE user_id = ?";
                            conn.query(sql, [scor, target_id], function (err, resu) {
                                if (err) return (res.send(err.sqlMessage));
                                else {
                                    get_user(req, res, true, target_username)
                                }
                            })
                        })
                    }
                })
            }
        })

    }
}

module.exports = score;