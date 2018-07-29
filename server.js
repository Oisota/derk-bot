const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const shakespeareInsult = require('shakespeare-insult');
const helmet = require('helmet');
const morgan = require('morgan');

const config = require(process.env.DERKBOT_CONFIG);
const port = process.env.PORT;
const bot_name = config.BOT_NAME;
const bot_id = config.BOT_ID;
const api_url = config.API_URL;

const http = axios.create({
	baseURL: api_url,
	timeout: 5000,
	responseType: 'json',
	headers: {
		'Content-Type': 'application/json',
	}
});

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(morgan('combined'));

app.post('/', (req, res) => {
	if (req.body.name === bot_name) { //don't want bot talking to itself
		return res.status(400).end();
	}

	//check if message syntax is correct
	const isInsult = req.body.text.slice(0,11) === 'Bill insult';
	const mentions = req.body.attachments.find(a => a.type === 'mentions');
	const hasMentions = mentions !== undefined;
	if (!(isInsult && hasMentions)) {
		return res.status(400).end();
	}

	//get mention location
	const start = mentions.loci[0][0];
	const end = mentions.loci[0][1] + start;

	//get mention string
	const mention = req.body.text.slice(start, end);

	//create message
	const message = `${mention} is a ${shakespeareInsult.random()}`;

	//post to api
	http.post('/', {
		bot_id: bot_id,
		text: message,
		attachments: [
			{
				type: 'mentions',
				user_ids: [
					mentions.user_ids[0]
				],
				loci: [
					[0, mention.length + 1]
				]
			}
		],
	}).then(resp => {
		console.log(resp.status);
	}).catch(err => {
		console.log(err);
	});

	res.status(200).end();
});

app.listen(port, () => {
	console.log(`Listening on port: ${port}`);
});
