const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const shakespeareInsult = require('shakespeare-insult');

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

	//check if message syntax is correct
	const isInsult = req.body.text.slice(0,14) === 'derkbot insult';
	const hasMentions = req.body.attachments.findIndex(a => a.type === 'mentions') !== -1;
	if (!(isInsult && hasMentions)) {
		return res.status(400).end();
	}

	//get mention location
	const start = req.body.attachments[0].loci[0][0];
	const end = req.body.attachments[0].loci[0][1] + start;

	//get mention string
	const mention = req.body.text.slice(start, end);

	//create message
	const message = mention + ' is a ' + shakespeareInsult.random();

	//post to api
	request.post({
		url: api_url,
		json: true,
		body: {
			attachments: [
			{
				type: 'mentions',
				user_ids: [
					req.body.attachments[0].user_ids[0]
				],
				loci: [
					[0, mention.length + 1]
				]
			}
			],
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
