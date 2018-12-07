let jwt = require("jsonwebtoken");
const JWT_SIGN_SECRET ="CleSecretePourLeMatchaJaiPasDideeDeCleSecretAlorsJeMetCa";

module.exports ={
    generateTokenForUser: function (userData) {
        return jwt.sign({
            type: "login",
            email: userData
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
         let email = -1;
         let token = module.exports.parseAutorization(authorization);
         if(token != null){
             try{
                 let jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
                 if(jwtToken != null){
                     email = jwtToken.email;
                     if(jwtToken.type === undefined){
                         return -1;
                     }
                 }
             }catch(err){

             }
         }
         return email;
     }
};