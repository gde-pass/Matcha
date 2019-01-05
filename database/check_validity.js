"use strict";
let jwtUtils = require("../utils/jwt.utils");
const validator = require("validator");
const util = require("util");
const bcrypt = require("bcrypt-nodejs");
const db = require("./database");
const empty = require("is-empty");


// ============= SETTINGS =============

/**
 * @return {boolean}
 */
function checkSettingsUpdate(data) {
    if ((data.first_name.length !== 0 && !checkName(data.first_name)) ||
        (data.last_name.length !== 0 && !checkName(data.last_name)) ||
        (data.username.length !== 0 && !checkUserPattern(data.username)) ||
        (data.email.length !== 0 && !checkEmailPattern(data.email)) ||
        (data.orientation.length !== 0 && !checkSexOrientationPattern(data.orientation)) ||
        (data.gender.length !== 0 && !checkGenderPattern(data.gender)) ||
        (data.bio.length !== 0 && !checkBioPattern(data.bio)) ||
        (data.tags.length !== 0 && !checkTagsPattern(data.tags)) ||
        (data.distance.length !== 0 && !checkDistancePattern(data.distance)) ||
        (data.age.length !== 0 && !checkAgePattern(data.age)) ||
        (data.ageRangeMin.length !== 0 && !checkAgePattern(data.ageRangeMin)) ||
        (data.ageRangeMax !== 0 && !checkAgePattern(data.ageRangeMax)) ||
        (data.password.length !== 0 && !checkPasswordPattern(data.password)) ||
        (data.password2.length !== 0 && !checkPasswordMatch(data.password, data.password2))) {
        return (false);
    } else {
        return (true);
    }
}

// ============= /SETTINGS =============

function checkAgePattern(value) {

    if (value < 18 || value > 100 || isNaN(value)) {
        return (false);
    } else {
        return (true);
    }
}


/**
 * @return {boolean}
 */
function checkDistancePattern(value) {

    if (value < 5 || value > 50 || isNaN(value)) {
        return (false);
    } else {
        return (true);
    }
}

/**
 * @return {boolean}
 */
function checkTagsPattern(value) {
    const tagsRegex = new RegExp("^(#+[a-zA-Z]{2,20}\\s?){1,10}");

    if (!value.match(tagsRegex)) {
        return (false);
    } else {
        return (true);
    }

}

/**
 * @return {boolean}
 */
function checkBioPattern(value) {

    if (value.length < 50 || value.length > 500) {
        return (false);
    } else {
        return (true);
    }
}

/**
 * @return {boolean}
 */
function checkGenderPattern(value) {
    const genderRegex = new RegExp("^(Female|Male)$");

    if (!value.match(genderRegex)) {
        return (false);
    } else {
        return (true);
    }
}

/**
 * @return {boolean}
 */
function checkSexOrientationPattern(value) {
    const sexOrientationRegex = new RegExp("^(Homosexual|Heterosexual|Bisexual)$");

    if (!value.match(sexOrientationRegex)) {
        return (false);
    } else {
        return (true);
    }
}

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
function checkName(value) {
    const NameRegex = new RegExp("^(?=.{2,40}$)[a-zA-Z]+(?:[-'\\s][a-zA-Z]+)*$");

    if (value.length === 0 || value.length > 40 ||
        value.length < 2 || !value.match(NameRegex)) {
        return (false);
    } else {
        return (true);
    }
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
async function checkNewUser(newUser, pool) {

    if (checkEmailPattern(newUser.email) && await checkEmailValidity(newUser.email, pool) &&
        checkUserPattern(newUser.user) && checkPasswordPattern(newUser.password) &&
        checkPasswordMatch(newUser.password, newUser.confirmPassword) &&
        checkName(newUser.first_name) && checkName(newUser.last_name)) {
        return (true);
    } else {
        return (false);
    }
}

/**
 * @return {boolean}
 */
async function checkLoginUser(user) {

    if (!checkEmailPattern(user.email) || !checkPasswordPattern(user.password)) {
        return (false);
    } else {

        let sql = "SELECT * FROM `Users` WHERE `email` = ?;";
        db.query = util.promisify(db.query);

        try {
            let result = await db.query(sql, [user.email]);
            if (result.length > 0) {
                let match = await bcrypt.compareSync(user.password, result[0].password);
                return (match);
            } else {
                return (false);
            }
        } catch (error) {
            throw error;
        }
    }
}

/**
 * @return {boolean}
 */
async function checkReset(user) {
    if (!checkPasswordPattern(user.password)) {
        return (false);
    } else {
        let data = jwtUtils.getUserID(user.token);
        if (data.email < 0) {
            return (false)
        }
        else if (data.type < 0 || data.type != "reset") {
            return (false)
        }
        let sql = 'SELECT * FROM Users WHERE email=?';
        db.query = util.promisify(db.query);

        try {
            let result = await db.query(sql, [data.email]);
            if (!empty(result[0])) {
                let hash = bcrypt.hashSync(user.password);
                let sqlReset = 'UPDATE Users SET password=? WHERE email=?';
                db.query = util.promisify(db.query);
                console.log(data.email);
                try {
                    let result = await db.query(sqlReset, [hash, data.email]);
                    if (!empty(result)) {
                        return (true)
                    } else {
                        return (false)
                    }
                } catch (error) {
                    throw error;
                }
            } else {
                return (false)
            }
        } catch (error) {
            throw error;
        }
    }
}

/**
 * @return {boolean}
 */
async function checkActivatedUser(data) {

    let sql = "SELECT `checked` FROM `Users` WHERE `email` = ?;";
    db.query = util.promisify(db.query);
    try {
        let result = await db.query(sql, [data.email]);
        if (result[0].checked === 1) {
            return (true);
        } else {
            return (false);
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    checkEmailValidity: checkEmailValidity,
    checkEmailPattern: checkEmailPattern,
    checkNewUser: checkNewUser,
    checkLoginUser: checkLoginUser,
    checkActivatedUser: checkActivatedUser,
    checkSettingsUpdate: checkSettingsUpdate,
    checkReset: checkReset,
};