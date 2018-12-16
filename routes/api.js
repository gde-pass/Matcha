const router = require("express").Router();
let empty = require('is-empty');
const jwtUtils = require("../utils/jwt.utils");
let conn = require('../database/database');

let findIfMach = require('../utils/find_If_matched');

router.post("/single/toggle_like", function (req, res) {
    function alreadyLiked(tab, compare) {
        let result = tab.filter(ret => { //regarde si jai deja liker cette utilisateur ou non
            if (ret.trim() == compare.toString().trim())
                return (true);
            else
                return (false)
        });
        return result;
    }

    function delFromTargetLikes(toDell, target) {
        let sql = "UPDATE matchs SET users_that_liked_you = ? WHERE user1_id = ? ";//update la bdd pour retirer son id des personne que j'ai aimer
        conn.query(sql, [toDell.toString(), target], function (errors, results, fiedls) {
            if (errors) {
                res.status(400).end()
            }
        })
    }

    function addToTargetLikes(toAdd, target) {
        let sql = "UPDATE matchs SET users_that_liked_you = ? WHERE user1_id = ? ";//update la bdd pour retirer son id des personne que j'ai aimer
        conn.query(sql, [toAdd.toString(), target], function (errors, results, fiedls) {
            if (errors) {
                res.status(400).end()
            }
        })
    }

    function AddOrDel(target, user_id) {
        let sql = "SELECT  * FROM matchs WHERE user1_id = ?"
        conn.query(sql, target, function (errors, results, fiedls) {
            if (errors) {
                res.status(400).end()
            }
            else if (!empty(results)) {
                users_target_liked = results[0].users_that_liked_you.split(',');
                if (alreadyLiked(users_target_liked, user_id) == user_id) {
                    var filtered = users_target_liked.filter(function (value,) {
                        return value != user_id;
                    });
                    delFromTargetLikes(filtered, target)
                } else {
                    users_target_liked.push(user_id)
                    addToTargetLikes(users_target_liked, target)
                }
            }
        })
    }

    function addToLikes(toAdd, user_id) {
        let sql = "UPDATE matchs SET users_you_liked = ? WHERE user1_id = ? ";//update la bdd pour retirer son id des personne que j'ai aimer
        conn.query(sql, [toAdd.toString(), user_id], function (errors, results, fiedls) {
            if (errors) {
                res.status(400).end()
            }
            else {
                res.status(200).json({
                    liked: false,
                })
            }
        })
    }

    function delFromLikes(toDel, user_id) {
        let sql = "UPDATE matchs SET users_you_liked = ? WHERE user1_id = ?"; //update la bdd pour l'ajouter a la liste des peronne aue jai aime
        conn.query(sql, [toDel.toString(), user_id], function (errors, results, fiedls) {
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
                matched_id = resu[0].users_you_liked.split(',');// met toute les personnes que j'ai aimer dans un tableau
// ------------------------------------------------------------------------------------------------------------------------------
                let sql = "SELECT `user_id` FROM `Users` WHERE `username` = ?;";// selectionne Id de l'utilisateur qui va etre liker
                conn.query(sql, req.body.target, function (err, result, fields) {
                    if (err) {
                        return (res.status(400).end())
                    }
                    else if (!empty(result)) {
                        if (alreadyLiked(matched_id, result[0].user_id) == result[0].user_id) { //si je l'ai deja liker je retire son id du tableau qui contien toute les personne que j'ai aimer
                            AddOrDel(result[0].user_id, data.Id);
                            var filtered = matched_id.filter(function (value,) {
                                return value != result[0].user_id;
                            });
                            addToLikes(filtered, user_id);
                            // ------------------------------------------------------------------------------------------------------------------------------
                        } else {// si je 'ai pas deja aimer
                            AddOrDel(result[0].user_id, data.Id);
                            matched_id.push(result[0].user_id)
                            delFromLikes(matched_id, user_id)
                        }
                    }
                })
            }
        })
    }
});

module.exports = router;