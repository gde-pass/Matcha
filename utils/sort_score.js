let conn = require('../database/database');


async function sortAge(req, res, users, cb) {
    let usersScores = [];
    let tabUsers = [];
    users.forEach(function (elem) {
        usersScores.push({
            score:elem.score,
            user: elem.user_id
        })
    })
    usersScores.sort(function (a, b) {
        return b - a
    });
    console.log(usersScores)

    for (let i = 0; i < usersScores.length; i++) {
        let sql = "SELECT * FROM Users JOIN Settings ON Users.user_id = Settings.user_id WHERE Users.user_id = ?";
        try {
            let result = await conn.query(sql, usersScores[i].user);
            tabUsers.push(result)
        } catch (error) {
            throw error;
        }
    }
    cb(null, tabUsers);
}

module.exports = sortAge;