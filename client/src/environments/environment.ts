// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,

  URL: {
    base:           'http://localhost:2000',
    auth: {
      login:        'http://localhost:2000/api/auth/login',
      token:        'http://localhost:2000/api/auth/token',
      updatepass:   'http://localhost:2000/api/auth/updatepassword',
    },
    dnl: {
      query:        'http://localhost:2000/api/dnl/query',
    },
    cms: {
      content:      'http://localhost:2000/api/cms',
    },
  }
};

// reflect only required in dev mode.
import 'core-js/es7/reflect';
