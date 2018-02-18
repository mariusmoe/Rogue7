import * as express from 'express';
import { Router, Request, Response, NextFunction } from 'express';
const subdomain = require('express-subdomain');

import { get as configGet, util as configUtil } from 'config';
import { join } from 'path';
import { createServer, server } from 'spdy';

import { Setup } from './setup';
import { Domains } from './interfaces';


class App {
	public app: express.Express;

	constructor() {
		console.time('Launch time');
		this.app = express();
		console.log('Launching Sotingane Static Files Server for ' + configUtil.getEnv('NODE_ENV') + '..');

		// SETUP
		Setup.initiate(this.app);

		// Routing to APIs
		this.initiateRoutes();

		// BOOT
		const options = {
			spdy: {
				protocols: <server.Protocol[]>['h2', 'spdy/3.1', 'http/1.1'],
				ssl: configUtil.getEnv('NODE_ENV') === 'production',
				plain: configUtil.getEnv('NODE_ENV') !== 'production'
			}
		};
		createServer(options, this.app).listen(this.app.get('port'), (err: string) => {
			if (err) { console.error(err); return process.exit(1); }
			if (configUtil.getEnv('NODE_ENV') === 'test') { return; }
			console.log(`Sotingane running on - Port ${this.app.get('port')}...`);
			console.timeEnd('Launch time');
		});
	}


	private initiateRoutes() {
		// HTTPS redirect
		if (configUtil.getEnv('NODE_ENV') === 'production') {
			const httpsRedirect = Router();
			httpsRedirect.all('*', (req: Request, res: Response, next: NextFunction) => {
				if (req.secure) { next(); return; }
				res.redirect('https://' + req.headers.host + req.originalUrl);
			});
			this.app.use('*', httpsRedirect);
		}

		// Set up API Routing
		const domains = configGet<Domains>('domains');
		console.log(domains);
		for (const domain in domains) {
			const apiRouting = Router();
			apiRouting.use('/api/*', (req: Request, res: Response) => {
				res.redirect(307, domains[domain] + req.originalUrl);
			});
			this.app.use(subdomain(domain, apiRouting));
		}

		// Serve static files that exists
		this.app.get('*.*', express.static(join(process.cwd(), 'www')));
		this.app.get('*', (req: Request, res: Response) => {
			res.sendFile(join(process.cwd(), 'www', 'index.html'));
		});
	}
}


export default new App().app;
