const express = require('express');
const db = require('../sql/db');
const cookieSession = require('cookie-session');
const router = express.Router();

router.post('/request', (req,res) => {
	var group = null;
    request = {
    	startAddress: req.body.startAddress,
        startLocationLat: req.body.startLocationLat,
        startLocationLong: req.body.startLocationLong,
        endAddress: req.body.endAddress,
        endLocationLat: req.body.endLocationLat,
        endLocationLong: req.body.endLocationLong,
        timeLeaving: req.body.timeLeaving,
        dateOfRequest: req.body.dateOfRequest,
    }
    POST_LOCATION = `INSERT into location (userId, startLocationLat, startLocationLong, endLocationLat, endLocationLong, timeLeaving, dateOfRequest, startAddress, endAddress) VALUES ('${req.session.user.userId}', '${request.startLocationLat}', '${request.startLocationLong}', '${request.endLocationLat}', '${request.endLocationLong}', '${request.timeLeaving}', '${request.dateOfRequest}', '${request.startAddress}', '${request.endAddress}')`;
    GET_GROUP_NUM = `SELECT groupNum from groups where userId = ${req.session.user.userId} && type = 'Owner`;
    GET_MATCH = `SELECT userId from location WHERE (startLocationLong  >= ${request.startLocationLong - .004} && startLocationLong <= ${request.startLocationLong + .004}) &&  (startLocationLat  >= ${request.startLocationLat - .004} && startLocationLat <= ${request.startLocationLat + .004}) && (endLocationLong  >= ${request.endLocationLong - .004} && endLocationLong <= ${request.endLocationLong + .004}) && (endLocationLat  >= ${request.endLocationLat - .004} && endLocationLat <= ${request.endLocationLat + .004})`;
    db.query(GET_MATCH, (error, results, fields) => {
		if(error) {
			res.send({
				"code":400,
				"failed":"error occurred",
				"error":error
			});
		} else {
			if(results.length > 0 && req.session.user.userId != results[0].userId) {
				res.send({
					"code":201,
					"success":"Match found",
					"userIds": results[0].userId
				});
			} else {
				db.query(POST_LOCATION, (error, results, fields) => {
		        if (error) {
		            res.send({
		                "code":400,
		                "failed":"error occurred",
		                "error":error
		            });
		        } else {
		        	group = Math.floor(Math.random() * 1000001);
		        	console.log(group);
		        	MAKE_GROUP = `INSERT into groups (groupNum, startAddress, endAddress, time, date, userId, type) VALUES (${group}, '${request.startAddress}', '${request.endAddress}', '${request.time}', ${request.date}, ${req.session.user.userId}, 'Owner')`;
		            db.query(MAKE_GROUP, (error, results, fields) => {
		            	if (error) {
		            		res.send({
		                		"code":400,
		                		"failed":"error occurred",
		                		"error":error
		            		});
		            	} else {
		            		req.session.group = group;
		            		req.session.request = request;
		            		res.send({
		            			"request": request,
		                		"code":202,
		                		"success":"Creating new request and group"
		            		});
		            	}
		            });
		        }
		    	});
			}	
		}
	});
});

module.exports = router;