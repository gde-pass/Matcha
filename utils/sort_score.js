let conn = require('../database/database');


async function sortAge(req, res, users, cb) {
    let usersScores = [];
    let tabUsers = [];
    users.forEach(function (elem) {
        usersScores.push(elem.score)
    })
    usersScores.sort(function (a, b) {
        return b - a
    });

    for (let i = 0; i < usersScores.length; i++) {
        let sql = "SELECT * FROM Users JOIN Settings ON Users.user_id = Settings.user_id WHERE score = ?";
        try {
            let result = await conn.query(sql, usersScores[i]);
            tabUsers.push(result)
        } catch (error) {
            throw error;
        }
    }
    console.log(tabUsers)
    cb(null, tabUsers);
}

module.exports = sortAge;