const router = require("express").Router();
let replace = require("str-replace");
let empty = require('is-empty');
const jwtUtils = require("../utils/jwt.utils");
let conn = require('../database/database');
let display_users = require("../utils/display_users");

router.post("/single/toggle_like", function (req, res) {
    let data = jwtUtils.getUserID(req.body.token);
    if (data.type < 0 || data.type !== "login" || data.email < 0) {
        res.status(400).json({
            error: "token"
        })
    } else {
        let sql = "SELECT * FROM matchs WHERE user1_id = ?";//selection toute les personne que moi jai aimé
        conn.query(sql, data.Id, function (err, resu, fi) {
            if (err) {
                res.status(400).end()
            }
            else if (!empty(resu)) {
                user_id = data.Id; //recupère mon id
                matched_id = resu[0].user2_id.split(',');// met toute les personnes que j'ai aimer dans un tableau
                let sql = "SELECT `user_id` FROM `Users` WHERE `username` = ?;";// selectionne Id de l'utilisateur qui va etre liker
                conn.query(sql, req.body.target, function (err, result, fields) {
                    if (err) {
                        return (res.status(400).end())
                    }
                    else if (!empty(result)) {
                        let alreadyLiked = matched_id.filter(ret => { //regarde si jai deja liker cette utilisateur ou non
                            if (ret.trim() == result[0].user_id.toString().trim())
                                return (true);
                            else
                                return (false)
                        });
                        if (alreadyLiked == result[0].user_id) { //si je l'ai deja liker je retire son id du tableau qui contien toute les personne que j'ai aimer
                            var filtered = matched_id.filter(function (value,) {
                                return value != result[0].user_id;
                            });
                            let sql = "UPDATE matchs SET user1_id = ?, user2_id = ?";//update la bdd pour retirer son id des personne que j'ai aimer
                            conn.query(sql, [user_id, filtered.toString()], function (errors, results, fiedls) {
                                if (errors) {
                                    res.status(400).end()
                                }
                                else {
                                    res.status(200).json({
                                        liked: false
                                    })
                                }
                            })

                        } else {// si je 'ai pas deja aimer
                            matched_id.push(result[0].user_id)
                            let sql = "UPDATE matchs SET user1_id = ?, user2_id = ?"; //update la bdd pour l'ajouter a la liste des peronne aue jai aime
                            conn.query(sql, [user_id, matched_id.toString()], function (errors, results, fiedls) {
                                if (errors) {
                                    res.status(400).end()
                                }
                                else {
                                    res.status(200).json({
                                        liked: true
                                    })
                                }
                            })
                        }
                    }
                })
            }
        })
    }
});

module.exports = router;