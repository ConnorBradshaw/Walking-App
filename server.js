const express = require('express');
const cors = require('cors');
const passport = require('passport');
const bodyparser = require('body-parser');
const cookieSession = require('cookie-session');
const group = require('./api/group');
const location = require('./api/location');
const user = require('./api/user');
const app = express();
app.use(cookieSession({secret:"hallo",resave:false,saveUninitialized:true}));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }))
app.use(cors());
app.use('/group', group);
app.use('/user', user);
app.use('/location', location);

app.get('/', (req,res) => {
	res.send("Hello");
});
var port = process.env.PORT || 4000;
app.listen(port, () => {
	console.log("Listening on port " + port);
});