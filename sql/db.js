const mysql = require('mysql');
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Kookie#1010',
    database : 'testdb',
    connectTimeout: 30000
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;