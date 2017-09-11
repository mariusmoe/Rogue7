import * as express from 'express';
import { get as configGet, util as configUtil } from 'config';

// models
import { User } from './models/user';
import { Content } from './models/content';


// setup
import { Setup } from './libs/setup';

// routing
import { AppRouter } from './router';

// boot
import * as mongoose from 'mongoose';
import * as http from 'http';
// import * as https from 'https';
import { readFileSync } from 'fs';
import 'path';


class App {
  public app;

  constructor() {
    this.app = express();
    console.log('Launching Node REST API for ' + configUtil.getEnv('NODE_ENV') + '..');

    // // MODELS
    // this.app.use(User);
    // this.app.use(Content);
    // console.log('[Models] completed');

    // SETUP
    Setup.initiate(this.app);

    // CONTROLLERS & ROUTER
    AppRouter.initiate(this.app);

    // BOOT
    this.boot();
  }

  private boot() {
    (<any>mongoose).Promise = Promise;
    const uri = configGet<string>('database');
    mongoose.connect(uri, { useMongoClient: true }, (error) => {
      if (error) {
        // if error is true, the problem is often with mongoDB not connection
        console.log('ERROR can\'t connect to mongoDB. Did you forgot to run mongod?');
      }
    }).then( () => {
      let server: http.Server;
      if(configUtil.getEnv('NODE_ENV') == 'production') {
        // PRODUCTION
        var options = {
          // cert: readFileSync('/etc/letsencrypt/live/vitensurvey.party/fullchain.pem'),
          // key: readFileSync('/etc/letsencrypt/live/vitensurvey.party/privkey.pem')
        };
        // var server = https.createServer(options, app);
        server = http.createServer(this.app);

      } else {
        // DEVELOPMENT
        server = http.createServer(this.app);
      }
      server.listen(this.app.get('port'), () => {
        if(configUtil.getEnv('NODE_ENV') !== 'test') {
          console.log(`Sotingane running on - Port ${this.app.get("port")}...`);
        };
      });
    }).catch( (err) => {
      console.log('ERROR can\'t connect to mongoDB. Did you forgot to run mongod?');
    });
  }
}


export default new App().app;
