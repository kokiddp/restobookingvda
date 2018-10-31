//Install express server
var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var path = require('path');

var ObjectID = mongodb.ObjectID;

var app = express();

var db;
var USERS_COLLECTION = "users";

app.use(bodyParser.json());
app.use(express.static(__dirname + '/dist'));

mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test", function (err, client) {
	if (err) {
		console.log(err);
		process.exit(1);
	}

	db = client.db();
	console.log("Database connection ready");
	
	var server = app.listen(process.env.PORT || 8080, function () {
		var port = server.address().port;
		console.log("App now running on port", port);
	});

});

var forceSSL = function() {
	return function (req, res, next) {
		if (req.headers['x-forwarded-proto'] !== 'https') {
			return res.redirect(
				['https://', req.get('Host'), req.url].join('')
			);
		}
		next();
	}
}
app.use(forceSSL());

/*
var error404 = function() {
	return function(req, res) {
		res.status(404).send('404 not found');
	}
}
app.use(error404());

var error500 = function() {
	return function(err, req, res, next) {
		console.error(err.stack);
		res.status(500).send('500 internal server error');
	}
}
app.use(error500());
*/

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/dist/index.html'));
});

function handleError(res, reason, message, code) {
	console.log("ERROR: " + reason);
	res.status(code || 500).json({"error": message});
}

app.get("/api/users", function(req, res) {
	handleError(res, "Not implemented", "Not implemented", 501);
});

app.post("/api/users", function(req, res) {
	handleError(res, "Not implemented", "Not implemented", 501);
});

app.get("/api/users/:id", function(req, res) {
	handleError(res, "Not implemented", "Not implemented", 501);
});

app.put("/api/users/:id", function(req, res) {
	handleError(res, "Not implemented", "Not implemented", 501);
});

app.delete("/api/users/:id", function(req, res) {
	handleError(res, "Not implemented", "Not implemented", 501);
});