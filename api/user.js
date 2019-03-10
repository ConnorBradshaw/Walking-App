const express = require('express');
const db = require('../sql/db');
const passport = require('passport');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const router = express.Router();
router.use(passport.initialize());
router.use(passport.session());
function encryptPassword(password) {
    const hash = bcrypt.hashSync(password, 10);
    return hash;
}
router.post('/login', (req, res) => {
	const user = {
		email: req.body.email,
		password: req.body.password,
		userId: "hello"
	}
    const CHECK_PASSWORD = `SELECT password, userId from user where email = '${user.email}'`;
    db.query(CHECK_PASSWORD, (error, results, fields) => {
        if (error) {
            res.send({
              "code":400,
              "failed":"error occurred"
            });
        } else {
            if(results.length > 0){
                if(bcrypt.compareSync(user.password, results[0].password)){
                	user.userId = results[0].userId;
                    req.session.user = user;
                    GET_GROUP_NUM = `SELECT groupNum from testdb.groups where userId = ${req.session.user.userId} && type = 'Owner'`;
					db.query(GET_GROUP_NUM, (error, results, fields) => {
						if(error) {
							res.send({
								"code":400,
								"failed":"error occurred",
								"error":error
							});
						} else {
							if(results.length > 0) {
								req.session.group = results[0].groupNum;

							}
		                    res.send({
		                        "user": user,
		                        "group": req.session.group,
		                        "code":200,
		                        "success":"login sucessful"
		                    });
						}
					});
                } else{
                    res.send({
                        "code":202,
                        "success":"Email and password does not match"
                    });
                }
            } else{
                res.send({
                    "code":203,
                    "success":"Email does not exist"
                });
            }
        }
    });
});
router.post('/register', (req, res) => {
    const user = {
        email: req.body.email,
        password: encryptPassword(req.body.password),
        userId: null
    }
    const CHECK_IF_EXISTS = `SELECT password from user where email = '${user.email}'`;
    const STORE_USER = `INSERT into user (email,password) VALUES('${user.email}', '${user.password}')`;
    db.query(CHECK_IF_EXISTS, (error, results, fields) => {
        if (error) {
            res.send({
              "code":400,
              "failed":"error occurred"
            });
        } else {
            if(results.length == 0){
                db.query(STORE_USER, (error, results, fields) => {
                    if (error) {
                        res.send({
                            "code":400,
                            "failed":"error occurred",
                            "error":error
                        });
                    } else {
                    	user.userId = results.insertId;
                        req.session.user = user;
                        res.send({
                            "user": user,
                            "code":200,
                            "success":"User added"
                        });
                    }
                });
            } else {
                res.send({
                    "code":203,
                    "success":"Email already exists"
                });
            }
        }
    });
});
router.get('/logout', (req,res) => {
    req.session = null;
    res.send({
        "code":200,
        "success":"User logged out"
    });
});
router.get('/status', (req,res) => {
    if(req.session.user) {
        res.send({
            "user": req.session.user,
            "code":200,
            "success":"User logged in"
        });
    } else {
        res.send({
            "code":204,
            "success":"User not logged in"
        });
    }
})
module.exports = router;