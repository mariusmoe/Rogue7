"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const express_1 = require("express");
const config_1 = require("config");
const path_1 = require("path");
const http_1 = require("http");
const setup_1 = require("./setup");
const vhost = require("vhost");
class App {
    constructor() {
        this.staticFiles = [];
        console.time('Launch time');
        this.app = express();
        console.log('Launching Sotingane Static Files Serrver for ' + config_1.util.getEnv('NODE_ENV') + '..');
        // SETUP
        setup_1.Setup.initiate(this.app);
        // Routing to APIs
        this.initiateRoutes();
        // BOOT
        http_1.createServer(this.app).listen(this.app.get('port'), () => {
            if (config_1.util.getEnv('NODE_ENV') === 'test') {
                return;
            }
            console.log(`Sotingane running on - Port ${this.app.get('port')}...`);
            console.timeEnd('Launch time');
        });
    }
    initiateRoutes() {
        // HTTPS redirect
        const httpsRedirect = express_1.Router();
        httpsRedirect.all('*', (req, res, next) => {
            if (req.secure) {
                next();
                return;
            }
            res.redirect('https://' + req.headers.host + req.url);
        });
        this.app.use('*', httpsRedirect);
        // Serve static files that exists
        this.app.get('*.*', express.static(path_1.join(process.cwd(), 'www')));
        // Set up API Routing
        const apiRouting = express_1.Router();
        const domains = config_1.get('');
        for (const domain in domains) {
            apiRouting.use(vhost(domain), (req, res) => {
                res.redirect(domains[domain]);
            });
        }
        this.app.use('/api', apiRouting);
    }
}
exports.default = new App().app;
//# sourceMappingURL=index.js.map