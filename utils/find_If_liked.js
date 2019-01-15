let empty = require('is-empty');
let conn = require('../database/database');

function findIfMatch(req, res, data, target, cb) {
    let sql = "SELECT * FROM matchs WHERE user1_id = ?";//selection toute les personne que moi jai aimé
    conn.query(sql, data.Id, function (err, resu, fi) {
        if (err) {
            return (res.send(err.sqlMessage));
        }
        else if (!empty(resu)) {
            user_id = data.Id; //recupère mon id
            users_That_Liked_Me = resu[0].users_that_liked_you.split(',');
// ------------------------------------------------------------------------------------------------------------------------------
            let sql = "SELECT `user_id` FROM `Users` WHERE `username` = ?;";// selectionne Id de l'utilisateur qui va etre liker
            conn.query(sql, target, function (err, result, fields) {
                if (err) {
                    return (res.send(err.sqlMessage));
                }
                else if (!empty(result)) {
                    // match1 = users_I_Liked.filter(ret => { //regarde si jai deja liker cette utilisateur ou non
                    //     if (ret.trim() == result[0].user_id.toString().trim())
                    //         return (true);
                    //     else
                    //         return (false)
                    // });
                    match2 = users_That_Liked_Me.filter(ret => { //regarde si jai deja liker cette utilisateur ou non
                        if (ret.trim() == result[0].user_id.toString().trim())
                            return (true);
                        else
                            return (false)
                    });
                    if (match2 == result[0].user_id) {
                        cb(null, true);
                    }
                    else {
                        cb(null, false);
                    }
                }
            })
        }
    })
}

module.exports = findIfMatch;