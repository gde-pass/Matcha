const db = require("./database");
const session = require('express-session');
const util = require("util");
var i;

async function Getparams(data, callback) {
	let sqlsend = "SELECT user_id, username, socketid FROM Useronline WHERE username= ?";
    db.query = util.promisify(db.query);
    try {
        let result = await db.query(sqlsend,[data]);
		if (result.length == 0) {
            return (false);
        } else {
            return (result[0]);
        }
    } catch (error) {
        // throw error;
    }
};

function SetConv(data) {
	let sqlsetconv = "UPDATE Useronline SET in_conv= ? WHERE user_id= ?";
	db.query(sqlsetconv,[data.to_user_id.user_id,data.from_user_id], function (error) {
		// if (error) throw error;
		 return (true);
	});
};

async function CheckConv(params){
    let checksql = "SELECT in_conv FROM Useronline WHERE user_id=?";
    db.query = util.promisify(db.query);
    try {
        let result = await db.query(checksql,[params.to_user_id]);
		if (result.length > 0) {
	        if (result[0].in_conv == params.from_user_id) {
	            return (true);
	        } else {
	            return (false);
	        }
		}else {
			return (false);
		}
    } catch (error) {
    }
};

async function useronlineUpdate(username, user_id) {
	let sql = "UPDATE Useronline SET username=? WHERE user_id= ?";
    db.query = util.promisify(db.query);

    try {
        await db.query(sql, [username, user_id]);
    } catch (error) {
        // throw error;
    }
}


module.exports = {
	Getparams: Getparams,
	SetConv: SetConv,
	CheckConv: CheckConv,
	useronlineUpdate: useronlineUpdate
};
