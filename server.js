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

var server = app.listen(process.env.PORT || 8080, function () {
	var port = server.address().port;
	console.log("App now running on port", port);
});

app.get('/*', function(req, res) {
	res.sendFile(path.join(__dirname + '/dist/index.html'));
});