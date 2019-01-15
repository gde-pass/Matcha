"use strict";
const db = require("./database");
const util = require("util");


function InsertMessage(params) {
    let insertsql = "INSERT INTO Messages (from_user_id, to_user_id, message, date) VALUES (?, ?, ?, NOW())";
    db.query(insertsql, [params.from_user_id, params.to_user_id, params.message], function (error) {
        // if (error)throw error;
    });
    return (true);
};

async function GetMessage(params){
    let getsql = "SELECT mess_id, from_user_id, to_user_id, message, date FROM Messages WHERE (from_user_id= ? AND to_user_id= ?) OR (from_user_id=? AND to_user_id= ?) ORDER BY mess_id";
    db.query = util.promisify(db.query);
    try {
        let result = await db.query(getsql,[params.from_user_id, params.to_user_id.user_id,params.to_user_id.user_id, params.from_user_id]);
        if (result.length == 0) {
            return (false);
        } else {
            return (result);
        }
    } catch (error) {
        // throw error;
    }
};


module.exports = {
    InsertMessage: InsertMessage,
    GetMessage: GetMessage
};
