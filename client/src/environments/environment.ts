// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

const baseURL = 'http://localhost:2000';

export const environment = {
  production: false,

  URL: {
    base:           baseURL,
    api:            baseURL + '/api',
    auth: {
      login:        baseURL + '/api/auth/login',
      token:        baseURL + '/api/auth/token',
      updatepass:   baseURL + '/api/auth/updatepassword',
    },
    steam: {
      servers:      baseURL + '/api/steam',
    },
    cms: {
      content:      baseURL + '/api/cms',
      search:       baseURL + '/api/cms/search',
    },
  }
};

// reflect only required in jit mode.
import 'core-js/es7/reflect';
