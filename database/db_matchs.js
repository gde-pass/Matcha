// "use strict";
const db = require("./database");
const util = require("util");
let empty = require('is-empty');

async function IsMatch(socket, target) {
    let sql = "SELECT * FROM matchs WHERE user1_id = ?";//selection toute les personne que moi jai aimé
    db.query = util.promisify(db.query);

    try {
        let resu = await db.query(sql, [socket.data.user_id]);
        // console.log('RESU IS MATCH :' ,resu);
        if (!empty(resu)) {
            let user_id = socket.data.user_id; //recupère mon id
            let users_I_Liked = resu[0].users_you_liked.split(',');// met toute les personnes que j'ai aimer dans un tableau
            let users_That_Liked_Me = resu[0].users_that_liked_you.split(',');

            let sql = "SELECT `user_id` FROM `Users` WHERE `username` = ?";// selectionne Id de l'utilisateur qui va etre liker
            db.query = util.promisify(db.query);
            try {
                let result = await db.query(sql, [target]);
                // console.log('RESU IS MATCH 2:' ,result);

                if (!empty(result)) {
                    let match1 = users_I_Liked.filter(ret => { //regarde si jai deja liker cette utilisateur ou non
                        if (ret.trim() == result[0].user_id.toString().trim())
                            return (true);
                        else
                            return (false)
                    });
                    let match2 = users_That_Liked_Me.filter(ret => { //regarde si jai deja liker cette utilisateur ou non
                        if (ret.trim() == result[0].user_id.toString().trim())
                            return (true);
                        else
                            return (false)
                    });
                    // console.log('MATCH1 == ', match1);
                    // console.log('MATCH2 == ', match2);
                    // console.log('RESU[0] :', result[0].user_id);
                    if (match1 == result[0].user_id && match2 == result[0].user_id) {
                        // console.log('PASS GOOD');
                        return (true);
                    }
                    else {
                        // console.log('PASS BAD');
                        return (false);
                    }
                }
    } catch(error){
    }
    }
} catch (error){
}
};



async function WasMatch(socket, target) {
    let sql = "SELECT * FROM matchs WHERE user1_id = ?";//selection toute les personne que moi jai aimé
    db.query = util.promisify(db.query);

    try{
        let resu = await db.query(sql, [socket.data.user_id]);
        // console.log('RESU WAS MATCH :' ,resu);

        if (!empty(resu)) {
            let user_id = socket.data.user_id; //recupère mon id
            let users_That_Liked_Me = resu[0].users_that_liked_you.split(',');
// ------------------------------------------------------------------------------------------------------------------------------

            let sql = "SELECT `user_id` FROM `Users` WHERE `username` = ?;";// selectionne Id de l'utilisateur qui va etre liker
            db.query = util.promisify(db.query);

            try{

                let result = await db.query(sql, [target]);
                // console.log('RESU WAS MATCH 2:' ,result);

                if (!empty(result)) {
                    let match2 = users_That_Liked_Me.filter(ret => { //regarde si jai deja liker cette utilisateur ou non
                        if (ret.trim() == result[0].user_id.toString().trim())
                            return (true);
                        else
                            return (false)
                    });
                    if (match2 == result[0].user_id) {
                        return (true);
                    }
                    else {
                        return (false);
                    }
                }
            } catch(error){
            }
            }
} catch(error){
}
};

module.exports = {
    WasMatch: WasMatch,
    IsMatch: IsMatch
};
