const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

let options = {
	host: '192.168.99.100',
	port: 3306,
	user: 'root',
	password: 'password',
	database: 'Matcha',
	schema: {
		tableName: 'sessionstore',
		columnNames: {
			session_id: 'session_id',
            // socket_id: 'socket_id',
			expires: 'expires',
			data: 'data'
		}
	}
};
var sessionStore = new MySQLStore(options);

module.exports = sessionStore;
