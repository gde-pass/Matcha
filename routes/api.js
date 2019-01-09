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

    function addToLikes(toAdd, user_id, data, target) {
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

    function delFromLikes(toDel, user_id, data, target) {
        let sql = "UPDATE matchs SET users_you_liked = ? WHERE user1_id = ?"; //update la bdd pour l'ajouter a la liste des peronne aue jai aime
        conn.query(sql, [toDel.toString(), user_id], function (errors, results, fiedls) {
            if (errors) {
                res.status(400).end()
            }
            else {

                res.status(200).json({
                    liked: true,
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
                        return (res.status(500).send(error.sqlMessage));
                    }
                    else if (!empty(result)) {
                        if (alreadyLiked(matched_id, result[0].user_id) == result[0].user_id) { //si je l'ai deja liker je retire son id du tableau qui contien toute les personne que j'ai aimer
                            AddOrDel(result[0].user_id, data.Id);
                            var filtered = matched_id.filter(function (value,) {
                                return value != result[0].user_id;
                            });
                            addToLikes(filtered, user_id, data, result[0].user_id);
                            // ------------------------------------------------------------------------------------------------------------------------------
                        } else {// si je 'ai pas deja aimer
                            AddOrDel(result[0].user_id, data.Id);
                            matched_id.push(result[0].user_id)
                            delFromLikes(matched_id, user_id, data, result[0].user_id)
                        }
                    }
                })
            }
        })
    }
});

router.post("/single/toggle_bloque", function (req, res) {
    let data = jwtUtils.getUserID(req.body.token);
    if (data.type < 0 || data.type !== "login" || data.email < 0) {
        res.status(400).json({
            error: "token"
        })
    } else {
        let sql = "SELECT `user_id` FROM `Users` WHERE `username` = ?;";// selectionne Id de l'utilisateur qui va etre liker
        conn.query(sql, req.body.target, function (err, result, fields) {
            if (err) {
                return (res.status(500).send(error.sqlMessage));
            }
            else if (!empty(result)) {
                let sql = "SELECT * FROM users_bloquer WHERE user_id = ?";
                conn.query(sql, [result[0].user_id], function (err, resu, fields) {
                    if (err) {
                        return (res.status(500).send(error.sqlMessage));
                    } else {
                        bloqued_id = resu[0].bloqued_by.split(',');
                        let have_bloqued = bloqued_id.filter(ret => {
                            if (ret.trim() == data.Id.toString().trim())
                                return (true);
                            else
                                return (false)
                        });
// ------------------------------------------------------------------------------------------------------------------------------
                        if (resu[0].is_bloqued == 0) {
                            console.log(have_bloqued[0])

                            if(have_bloqued[0] != data.Id) {
                                bloqued_id.push(data.Id);

                                let sql = "UPDATE users_bloquer SET bloqued_by = ? WHERE user_id = ?";
                                conn.query(sql, [bloqued_id.toString(), result[0].user_id], function (err, results, fields) {
                                    if (err) {
                                        return (res.status(500).send(error.sqlMessage));
                                    } else {
                                        let sql = "UPDATE users_bloquer SET is_bloqued = ? WHERE user_id = ?";
                                        conn.query(sql, [1, result[0].user_id], function (err, result, fields) {
                                            if (err) {
                                                return (res.status(500).send(error.sqlMessage));
                                            } else {
                                                res.status(200).json({
                                                    bloqued: true,
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        } else if (resu[0].is_bloqued == 1) {
                            if(have_bloqued[0] == data.Id) {
                                var filtered = bloqued_id.filter(function (value) {
                                    return value != data.Id;
                                });
                            }
                            let sql = "UPDATE users_bloquer SET bloqued_by = ? WHERE user_id = ?";
                            conn.query(sql, [filtered.toString(), result[0].user_id], function (err, results, fields) {
                                if (err) {
                                    return (res.status(500).send(error.sqlMessage));
                                }else {
                                    let sql = "UPDATE users_bloquer SET is_bloqued = ? WHERE user_id = ?";
                                    conn.query(sql, [0, result[0].user_id], function (err, result, fields) {
                                        if (err) {
                                            return (res.status(500).send(error.sqlMessage));
                                        } else {
                                            res.status(200).json({
                                                bloqued: false,
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
            }
        })
    }
})

module.exports = router;