export const environment = {
  production: true,

  URL: {
    base:           'https://soting.net',
    auth: {
      login:        'https://soting.net/api/auth/login',
      token:        'https://soting.net/api/auth/token',
      updatepass:   'https://soting.net/api/auth/updatepassword',
    },
    steam: {
      dnl:          'https://soting.net/api/steam/dnl',
      ark:          'https://soting.net/api/steam/ark',
    },
    cms: {
      content:      'https://soting.net/api/cms',
    },
  }
  // URL: {
  //   base:           'http://localhost:2000',
  //   auth: {
  //     login:        'http://localhost:2000/api/auth/login',
  //     token:        'http://localhost:2000/api/auth/token',
  //     updatepass:   'http://localhost:2000/api/auth/updatepassword',
  //   },
  //   steam: {
  //     dnl:          'http://localhost:2000/api/steam/dnl',
  //     ark:          'http://localhost:2000/api/steam/ark',
  //   },
  //   cms: {
  //     content:      'http://localhost:2000/api/cms',
  //   },
  // }
};
