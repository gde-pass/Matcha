let jwt = require("jsonwebtoken");
const JWT_SIGN_SECRET ="CleSecretePourLeMatchaJaiPasDideeDeCleSecretAlorsJeMetCa";
const empty = require("is-empty");

module.exports ={
    generateTokenForUser: function (userData, type) {
        return jwt.sign({
                type: type,
                email: userData.email,
                first_name: userData.first_name,
                last_name: userData.last_name,
                Id: userData.user_id,
                username: userData.username,
            },
            JWT_SIGN_SECRET,
            {
                expiresIn: "6h"
            })
    },
    getUserID: function (authorization) {
        var data = {
            email : -1,
            type : -1,
            first_name: -1,
            last_name: -1,
            username: -1,
            Id: -1,
            exp: -1,
        };
        let token = authorization;
        if(token != null){
            try{
                let jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
                if(jwtToken != null){
                    data = {
                        email : jwtToken.email,
                        type : jwtToken.type,
                        first_name: jwtToken.first_name,
                        last_name: jwtToken.last_name,
                        username: jwtToken.username,
                        Id: jwtToken.Id,
                        exp: jwtToken.exp
                    };

                    if(jwtToken.type === undefined){
                        return -1;
                    }
                }
            }catch(err){
                // console.log(err)
            }
        }
        return data;
    }
};

// async function findIfBloqued(req, res, my_Id,users){
//     let filtered;
//     filtered = await users.filter(async elem => {
//         let sql = "SELECT bloqued_by FROM users_bloquer WHERE user_id =?"
//         await conn.query(sql,elem.user_id , async function (errors, results) {
//             if (errors) return (res.status(500).send(error.sqlMessage));
//             else{
//                 let bloqued_id = results[0].bloqued_by.split(',');
//                 await bloqued_id.forEach(value => {
//                     if(parseInt(value) == my_Id) {
//                         found_user = elem;
//                         return (true)
//                     }else return (false)
//                 })
//             }
//         })
//     })
//     // if(found_user != null) {
//     //      filtered = await users.filter(elem => {
//     //         if (elem.user_id == found_user.user_id) {
//     //             return (false);
//     //         }
//     //         else
//     //             return (true)
//     //     })
//     // return (filtered);
//     // }else{
//     return (users);
//     // }
// }

