//Install express server
var express = require("express");
var bodyParser = require("body-parser");
var path = require('path');

var app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/dist'));

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

var server = app.listen(process.env.PORT || 8080, function () {
	var port = server.address().port;
	console.log("App now running on port", port);
});

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/dist/index.html'));
});