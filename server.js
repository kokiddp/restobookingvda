//Install express server
const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/restobookingvda'));

app.get('/*', function(req,res) {
    
res.sendFile(path.join(__dirname+'/dist/restobookingvda/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080, function () {
	var port = server.address().port;
	console.log("App now running on port", port);
});