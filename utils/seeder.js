let faker = require('faker');
let conn = require('../database/database');
const dbUser = require("../database/user.js");
const _cliProgress = require('cli-progress');
var exit = require('exit');

const bar1 = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic);


// start the progress bar with a total value of 200 and start value of 0

// update the current value in your application..

// stop the progress bar
function findId(email){
    let sql2 = "SELECT `user_id` FROM `Users` WHERE `email` = ?;";
    let result = conn.query(sql2, [email]);
    return (result);
}

async function seed() {
    let  i = 0;
    bar1.start(600, i);

    while( i < 600) {
        let first_name = faker.name.firstName();
        let last_name = faker.name.lastName();
        let email = faker.internet.email();
        let hash = faker.internet.password();
        let user = faker.internet.userName();
        let latitude = Math.floor(Math.random() * 50) + 43;
        let longitude = Math.floor(Math.random() * 8) + (-2);
        let score = Math.floor(Math.random() * 5) + 0;

        let gender = faker.name.prefix();
        let bio = faker.lorem.paragraph();
        let orientation = Math.floor(Math.random() * 2) + 0;
        let distance = Math.floor(Math.random() * 50) + 0;
        let age = Math.floor(Math.random() * 100) + 18;


        if (gender == "Mr.") gender = "Male";
        if (gender == "Mrs.") gender = "Female";
        if (gender == "Ms.") gender = "Female";
        if (gender == "Miss") gender = "Female";
        if (gender == "Dr.") gender = "Male";

        if (orientation == 0) orientation = "Heterosexual";
        if (orientation == 1) orientation = "Homosexual";

        let data = {
            first_name :first_name,
            last_name: last_name,
            email: email,
            hash: hash,
            user:user

        }
        await dbUser.dbInsertNewUser(data);

        let sql1 = "UPDATE Users SET checked=?, latitude=?, longitude=?, score=? WHERE email=?";
        try {
            await conn.query(sql1, [1, latitude, longitude, score, email]);

            let result = await findId(email);
            let sql3 = "UPDATE Settings SET orientation=?, gender=?, bio=?, tags=?, distance=?, age=? WHERE user_id=?";
            await conn.query(sql3, [orientation, gender, bio, null, distance, age, result[0].user_id]);
        } catch (error) {
            // throw error;
        }
        bar1.increment(1);
        i++

    }
    bar1.stop();
    exit(0);
}
seed()

