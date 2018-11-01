//Install express server
var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var path = require('path');

var ObjectID = mongodb.ObjectID;

var app = express();

var db;
var dbString = "mongodb://heroku_759xkrdf:rf6nb8dgi9fuu1ob5mrvlva9hl@ds247223.mlab.com:47223/heroku_759xkrdf";
var USERS_COLLECTION = "users";

app.use(bodyParser.json());
app.use(express.static(__dirname + '/dist'));

mongodb.MongoClient.connect(process.env.MONGODB_URI || dbString, {useNewUrlParser: true}, function (err, client) {
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

/*
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
*/

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/dist/index.html'));
});

function handleError(res, reason, message, code) {
	console.log("ERROR: " + reason);
	res.status(code || 500).json({"error": message});
}

app.get("/api/debug/mongodb", function(req, res) {
	res.status(200).send(process.env.MONGODB_URI || dbString);
});

app.get("/api/users", function(req, res) {
	db.collection(USERS_COLLECTION).find({}).toArray(function(err, docs) {
		if (err) {
			handleError(res, err.message, "Failed to get users.");
		} else {
			res.status(200).json(docs);
		}
	});
});

app.post("/api/users", function(req, res) {
	var newDoc = req.body;
	newDoc.createDate = new Date();

	if (!req.body.username) {
		handleError(res, "Invalid user input", "Must provide a username.", 400);
	} else {
		db.collection(USERS_COLLECTION).insertOne(newDoc, function(err, doc) {
			if (err) {
				handleError(res, err.message, "Failed to create new user.");
			} else {
				res.status(201).json(doc.ops[0]);
			}
		});
	}
});

app.get("/api/users/:id", function(req, res) {
	db.collection(USERS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
		if (err) {
		  handleError(res, err.message, "Failed to get user");
		} else {
		  res.status(200).json(doc);
		}
	});
});

app.put("/api/users/:id", function(req, res) {
	var updatedDoc = req.body;
	delete updatedDoc._id;

	db.collection(USERS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updatedDoc, function(err, doc) {
		if (err) {
			handleError(res, err.message, "Failed to update user");
		} else {
			updatedDoc._id = req.params.id;
			res.status(200).json(updatedDoc);
		}
	});
});

app.delete("/api/users/:id", function(req, res) {
	db.collection(USERS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
		if (err) {
			handleError(res, err.message, "Failed to delete user");
		} else {
			res.status(200).json(req.params.id);
		}
	});
});

app.use(function(req, res, next) {
	res.status(404).send('Error 404: not found');
});