let conn = require('../database/database');

async function sortAge(req, res, users, cb) {
    let usersAges = [];
    let tabUsers = [];
    users.forEach(function (elem) {
        usersAges.push({
            age: elem.age,
            user: elem.user_id
        })
    })
    usersAges.sort(function (a, b) {
        return a.age - b.age
    });

    for (let i = 0; i < usersAges.length; i++) {
        let sql = "SELECT * FROM Users JOIN Settings ON Users.user_id = Settings.user_id WHERE Users.user_id = ?";
        try {
            let result = await conn.query(sql, usersAges[i].user);
            tabUsers.push(result)
        } catch (error) {
            cb(error, users);
        }
    }
    cb(null, tabUsers);
}

module.exports = sortAge;