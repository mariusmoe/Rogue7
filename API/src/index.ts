import * as express from 'express';
import { get as configGet, util as configUtil } from 'config';

// setup
import { Setup } from './libs/setup';

// routing
import { AppRouter } from './router';

// boot
import { connect as MongooseConnect } from 'mongoose';
import { createServer, Server } from 'http';
// import * as https from 'https';
import { readFileSync } from 'fs';


class App {
	public app: express.Express;

	constructor() {
		console.time('Launch time');
		this.app = express();
		console.log('Launching Node REST API for ' + configUtil.getEnv('NODE_ENV') + '..');

		// SETUP
		Setup.initiate(this.app);

		// CONTROLLERS & ROUTER
		AppRouter.initiate(this.app);

		// BOOT
		this.boot();
	}

	private boot() {
		const uri = process.argv[2] || configGet<string>('database');

		MongooseConnect(uri, (error) => {
			if (error) {
				// if error is true, the problem is often with mongoDB not connection
				console.log('ERROR can\'t connect to mongoDB. Did you forgot to run mongod?');
				console.log(error);
				return;
			}
			let server: Server;
			if (configUtil.getEnv('NODE_ENV') === 'production') {
				// PRODUCTION
				var options = {
					// cert: readFileSync('/path/to/cert'),
					// key: readFileSync('/path/to/privkey')
				};
				// var server = https.createServer(options, app);
				server = createServer(this.app);

			} else {
				// DEVELOPMENT
				server = createServer(this.app);
			}
			server.listen(this.app.get('port'), () => {
				if (configUtil.getEnv('NODE_ENV') === 'test') { return; }
				console.log(`Sotingane running on - Port ${this.app.get('port')}...`);
				console.timeEnd('Launch time');
			});
		});
	}
}


export default new App().app;