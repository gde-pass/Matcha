let jwt = require("jsonwebtoken");
const JWT_SIGN_SECRET ="CleSecretePourLeMatchaJaiPasDideeDeCleSecretAlorsJeMetCa";
const empty = require("is-empty");

module.exports ={
    generateTokenForUser: function (userData, type) {
        console.log(userData);
        return jwt.sign({
            type: type,
            email: userData.email,
            first_name: userData.first_name,
            last_name: userData.last_name,
            username: userData.display_name,
            },
        JWT_SIGN_SECRET,
            {
            expiresIn: "1h"
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
             username: -1
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