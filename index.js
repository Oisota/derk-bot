const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const port = process.env.PORT
const bot_name = process.env.BOT_NAME;
const bot_id = process.env.BOT_ID;
const api_url = 'https://api.groupme.com/v3/bots/post'

const app = express();

app.use(bodyParser.json());

app.post('/', (req, res) => {
	if (req.body.name === bot_name) { //don't want bot talking to itself
		return res.status(400).end();
	}


	//simple echo bot 
	const message = req.body.name + ' said: ' + req.body.text;

	request.post({
		url: api_url,
		json: true,
		body: {
			bot_id: bot_id,
			text: message,
		}
	}, (err, resp, body) => {
		console.log(resp.statusCode);
	});

	res.status(200).end();
});

app.listen(port, () => {
	console.log('Listening on port: ' + port);
})
