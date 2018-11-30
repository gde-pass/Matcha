"use strict";

function check_email_pattern(email) {
    const emailRegex = new RegExp("[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$");

    if (!email.match(emailRegex) || email.length > 254 || email.length < 3) {
        return (false);
    }
    return (true);
}

function check_user_pattern(user) {
    const userRegex = new RegExp("^[0-9a-zA-Z]+$");

    if (!user.match(userRegex) || user.length > 15 || user.length < 2) {
        return (false);
    }
    return (true);
}

async function check_email_validity(email, pool) {

    const util = require("util");
    let sql = "SELECT `email` FROM Users WHERE `email`= ?;";

    pool.query = util.promisify(pool.query);
    try {
        let result = await pool.query(sql, [email]);
        if (result.length > 0) {
            return (false);
        } else {
            return (true);
        }
    } catch (error) {
        throw error;
    }

}

module.exports = {
    check_email_validity: check_email_validity,
    check_email_pattern: check_email_pattern,
};