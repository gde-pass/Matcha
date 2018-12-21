let conn = require('../database/database');


async function sortAge(req, res, users, cb) {
    let usersAges = [];
    let tabUsers = [];

    users.forEach(function (elem) {
        usersAges.push(elem.age)
    })
    usersAges.sort(function (a, b) {
        return a - b
    });
    for (let i = 0; i < usersAges.length; i++) {
        let sql = "SELECT * FROM Users JOIN Settings ON Users.user_id = Settings.user_id WHERE age = ?";
        try {
            let result = await conn.query(sql, usersAges[i]);
            tabUsers.push(result)
        } catch (error) {
            throw error;
        }
    }
    cb(null, tabUsers);
}

module.exports = sortAge;