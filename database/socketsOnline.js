const db = require("./database");
const session = require('express-session');
const util = require("util");
var i;


function StoreUser(email, callback) {
	let sql = "SELECT `user_id` FROM `Users` WHERE email= ?;";
	db.query(sql, [email], function (err, rows) {
		if (err) throw err;
		// console.log(rows[0]);
		return callback(rows[0].user_id);
	});
}

function SetStore(socketid, json, id_user) {
	// console.log('in ---> ID: ', id_user);
	for (i in json) {
		if (json[i].id_user == id_user) {
			json[i].socketid = socketid;
			// console.log('in socket id: ', socketid);

		}
	}
	return (json);
}

async function Getparams(data, callback) {
	let sqlsend = "SELECT user_id, username, socketid FROM Useronline WHERE username= ?";
	db.query(sqlsend,[data], function (error, results) {
		if (error) throw error;
		 return (results[0].user_id);
	});
};

function SetConv(data) {
	let sqldisconnect = "UPDATE Useronline SET in_conv= ? WHERE user_id= ?";
	db.query(sqlsetconv,[data,data], function (error, results) {
		if (error) throw error;
		 return (true);
	});
};

async function CheckConv(params){
    let checksql = "SELECT in_conv FROM Useronline WHERE user_id=?";
    db.query = util.promisify(db.query);

    try {
        let result = await db.query(checksql,[params.from_user_id, params.to_user_id,params.to_user_id, params.from_user_id]);
        console.log('IN', result.length);
        if (result[0].in_conv == params) {
            return (true);
        } else {
            return (false);
        }
    } catch (error) {
        throw error;
    }
};


module.exports = {
	StoreUser: StoreUser,
	SetStore: SetStore,
	Getparams: Getparams,
	SetConv: SetConv
};
