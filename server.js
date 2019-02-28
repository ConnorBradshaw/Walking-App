const express = require('express');
const cors = require('cors');
const passport = require('passport');
const bodyparser = require('body-parser');
const group = require('./api/group');
const location = require('./api/location');
const user = require('./api/user');
const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }))
app.use(cors());
app.use('/group', group);
app.use('/user', user);
app.use('/location', location);

app.listen(4000, () => {
	console.log("Listening on port 4000");
});