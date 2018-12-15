const db = require("./database");
const session = require('express-session');
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


module.exports = {
	StoreUser: StoreUser,
	SetStore: SetStore,
	Getparams: Getparams
};
