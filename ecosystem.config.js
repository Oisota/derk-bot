module.exports = {
	apps: [
		{
			name: 'derk-bot',
			script: 'server.js',
			exec_mode: 'cluster',
			instances: 'max',
			env: {
				NODE_ENV: 'development',
				DERKBOT_CONFIG: './data/config.json',
				PORT: 9000,
			},
			env_production: {
				NODE_ENV: 'production',
				DERKBOT_CONFIG: '/home/derek/derk-bot-config.json',
			},
		},
	],
	deploy: {
		production: {
			user: 'derek',
			host: '45.55.54.239',
			ref: 'origin/master',
			repo: 'git@github.com:Oisota/derk-bot.git',
			path: '/home/derek/node-apps/derk-bot',
			'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
		},
	}
};
