// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,

  URL: {
    base:           'http://localhost:2000',
    login:          'http://localhost:2000/api/auth/login',
    renewJWT:       'http://localhost:2000/api/auth/renewjwt',
    newUser:        'http://localhost:2000/api/auth/newuser',
    queryGameServer: 'http://localhost:2000/api/dnl/query',
  }
};

// reflect only required in dev mode.
import 'core-js/es7/reflect';
