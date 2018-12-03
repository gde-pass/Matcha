"use strict";
const validator = require("validator");

/**
 * @return {boolean}
 */
function checkEmailPattern(email) {
    const emailRegex = new RegExp("[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$");

    if (!email.match(emailRegex) || email.length > 254 || email.length < 3 ||
        !validator.isEmail(email) || !validator.isLowercase(email)) {
        return (false);
    }
    return (true);
}

/**
 * @return {boolean}
 */
function checkUserPattern(user) {
    const userRegex = new RegExp("^[0-9a-zA-Z]+$");

    if (!user.match(userRegex) || user.length > 15 ||
        user.length < 2 || !validator.isAlphanumeric(user)) {
        return (false);
    }
    return (true);
}

/**
 * @return {boolean}
 */
function checkPasswordPattern(password) {
    const passwordRegex = new RegExp("((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,20})");

    if (password.length === 0 || password.length < 6 ||
        password.length > 20 || !password.match(passwordRegex)) {
        return (false);
    } else {
        return (true);
    }
}

/**
 * @return {boolean}
 */
function checkPasswordMatch(password1, password2) {
    if (password1 !== password2 || password1.length === 0 ||
        password2.length === 0 || !validator.equals(password1, password2)) {
        return (false);
    } else {
        return (true);
    }
}

/**
 * @return {boolean}
 */
async function checkEmailValidity(email, pool) {

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

/**
 * @return {boolean}
 */
async function CheckNewUser(newUser, pool) {
    console.log(newUser);

    if (checkEmailPattern(newUser.email) && await checkEmailValidity(newUser.email, pool) &&
        checkUserPattern(newUser.user) && checkPasswordPattern(newUser.password) &&
        checkPasswordMatch(newUser.password, newUser.confirmPassword)) {
        return (true);
    } else {
        return (false);
    }
}

module.exports = {
    checkEmailValidity: checkEmailValidity,
    checkEmailPattern: checkEmailPattern,
    CheckNewUser: CheckNewUser,
};