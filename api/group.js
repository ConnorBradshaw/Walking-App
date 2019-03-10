const express = require('express');
const db = require('../sql/db');
const cookieSession = require('cookie-session');
const router = express.Router();
router.post('/sendRequest', (req,res) => {
	 userId = req.body.userId;
	 SEND_REQUEST = `INSERT into request (requesterId, requesteeId, status) VALUE (${req.session.user.userId}, ${userId}, 'unresolved')`
	 db.query(SEND_REQUEST, (error, results, fields) => {
	 	if(error) {
	 		res.send({
	 			"code":404,
	 			"failed":"error occurred",
	 			"error":error
	 		});
	 	} else {
	 		res.send({
	 			"code":200,
	 			"success":"Request sent"
	 		});
	 	}
	 });
});
router.post('/decideRequest', (req,res) => {
	decision = req.body.decision;
	reqNum = req.body.reqNum;
	reqId = req.body.reqId;
	groupNum = req.session.group;
	ADD_TO_GROUP = `INSERT into testdb.groups (groupNum, userId, type) VALUE (${groupNum}, ${reqId}, 'Member')`;
	if(decision == "accept") {
		RESOLVE_REQUEST = `UPDATE request set status = 'accepted' where reqId = ${reqNum}`;
		db.query(ADD_TO_GROUP, (error, results, fields) => {
			if(error) {
				res.send({
					"code":404,
					"failed":"error occurred",
					"error":error
				});
			} else {
				db.query(RESOLVE_REQUEST, (error, results, fields) => {
					if(error) {
						res.send({
						"code":404,
						"failed":"error occurred",
						"error":error
					});
					} else {
						res.send({
							"code":200,
							"success":"Added user to group"
						});
					}
				});
			}
		});
	} else if(decision == "deny") {
		RESOLVE_REQUEST = `UPDATE request set status = 'denied' where requesterId = ${reqNum}`;
		db.query(RESOLVE_REQUEST, (error, results, fields) => {
			if(error) {
				res.send({
					"code":404,
					"failed":"error occurred",
					"error":error
				});
			} else {
				res.send({
					"code":200,
					"success":"Denied requestor"
				});
			}
		})

	}


});
router.get('/checkForRequest', (req,res) => {
	userId = req.session.user.userId;
	CHECK_REQUEST = `SELECT requesterId, reqId from request WHERE requesteeId = ${userId} && status = 'unresolved'`;
	db.query(CHECK_REQUEST, (error, results, fields) => {
		if(error) {
				res.send({
					"code":404,
					"failed":"error occurred",
					"error":error
				});
			} else {
				if(results.length > 0) {
					var object = {
						"code":200,
						"success":"Requests",
					}
					for(var i in results) {
						object["[" + i + "] User ID"] = results[i].requesterId,
						object["[" + i + "] Request Num:"] = results[i].reqId
					}
					res.send(object);
				} else {
					res.send({
						"code":204,
						"success":"No requests found"
					});
				}
			}
	});

});
router.get('/checkSentRequest', (req,res) => {
	userId = req.session.user.userId;
	CHECK_REQUEST = `SELECT status, reqId from request WHERE requesterId = ${userId}`;
	db.query(CHECK_REQUEST, (error, results, fields) => {
		if(error) {
				res.send({
					"code":404,
					"failed":"error occurred",
					"error":error
				});
			} else {
				if(results.length > 0) {
					var object = {
						"code":200,
						"success":"Status of requests",
					}
					for(var i in results) {
						object["[" + i + "] Request Num"] = results[i].reqId,
						object["[" + i + "] Status"] = results[i].status
					}
					res.send(object);
				} else {
					res.send({
						"code":204,
						"success":"No requests found"
					});
				}
			}
	});
});
router.get('/checkGroupMembers', (req,res) => {
	CHECK_GROUP_MEMBERS = `SELECT userId from testdb.groups where groupNum = ${req.session.group}`;
	db.query(CHECK_GROUP_MEMBERS, (error, results, fields) => {
		if(error) {
			res.send({
				"code":404,
				"failed":"error occurred",
				"error":error
			});
		} else {
			if(results.length > 0) {
				var object = {
				"code":200,
				"success":"Found group members",
				}
				for(var i in results) {
					object[i] = results[i].userId
				}
				res.send(object);
			} else {
				res.send({
					"code":204,
					"success":"No group members found"
				});
			}
		}
	});
});


module.exports = router;