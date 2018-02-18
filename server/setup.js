"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("config");
const compression = require("compression");
const helmet = require("helmet");
const logger = require("morgan");
class Setup {
    /**
     * Initiates setup
     * @param  {Express} app express
     */
    static initiate(app) {
        // Compress / gzip outgoing
        app.use(compression({
            filter: (req) => { return !req.headers['x-no-compression']; }
        }));
        // Secure app with helmet, less xss
        app.use(helmet());
        // set port
        app.set('port', process.env.PORT || 8080);
        // Logging
        if (config_1.util.getEnv('NODE_ENV') !== 'test') {
            //use morgan to log at command line
            app.use(logger(config_1.get('loggingMode')));
        }
    }
}
exports.Setup = Setup;
//# sourceMappingURL=setup.js.map