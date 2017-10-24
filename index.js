const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const config = require('./config');


const app = express();

app.use(bodyParser.json());

app.post('/', (req, res) => {
	if (req.body.name === config.bot_name) { //don't want bot talking to itself
		return res.status(400).end();
	}


	//simple echo bot 
	const message = req.body.name + ' said: ' + req.body.text;

	request.post({
		url: config.url,
		json: true,
		body: {
			bot_id: config.bot_id,
			text: message,
		}
	}, (err, resp, body) => {
		console.log(resp.statusCode);
	});

	res.status(200).end();
});

app.listen(config.port, config.addr, () => {
	console.log('Listening on ' + config.addr + ':' + config.port);
})
