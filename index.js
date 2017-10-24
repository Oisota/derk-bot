const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const config = require('./config');

const app = express();


app.use(bodyParser.json());

app.post('/', (req, res) => {
	if (req.body.sender_id === config.bot_id) { //don't want bot talking to itself
		res.status(400).end()
	}
	//do stuff here
	res.status(200).end();
});

app.listen(config.port, config.addr, () => {
	console.log('Listening on port: ' + config.port);
})
