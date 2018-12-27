let jwt = require("jsonwebtoken");
const JWT_SIGN_SECRET ="CleSecretePourLeMatchaJaiPasDideeDeCleSecretAlorsJeMetCa";

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
    parseAutorization: function (authorization) {
        return (authorization != null) ? authorization.replace("Bearer ", "") : null;
    },
    getUserID: function (authorization) {
        var data = {
            email : -1,
            type : -1,
            first_name: -1,
            last_name: -1,
            username: -1,
            Id: -1,
        };
        let token = module.exports.parseAutorization(authorization);
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

            }
        }
        return data;
    }
};