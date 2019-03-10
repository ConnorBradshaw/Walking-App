const mysql = require('mysql');
const connection = mysql.createConnection({
    host     : 'us-cdbr-iron-east-03.cleardb.net',
    user     : 'b5db49fa739410',
    password : '8caa606c',
    database : 'heroku_37fbcba44897bb9',
    connectTimeout: 30000
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;