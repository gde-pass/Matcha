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

// function DelStore(socketid, json, id_user) {
// 	console.log('in ---> ID: ', id_user);
// 	for (i in json) {
// 		if (json[i].socketid == id_user) {
// 			json[i].socketid = socketid;
// 			// console.log('in socket id: ', socketid);
//
// 		}
// 	}
// 	return (json);
// }

module.exports = {
	StoreUser: StoreUser,
	SetStore: SetStore
};
