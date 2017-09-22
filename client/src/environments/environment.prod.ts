export const environment = {
  production: true,

  URL: {
    base:           'http://173.212.225.7',
    auth: {
      login:        'http://173.212.225.7/api/auth/login',
      token:        'http://173.212.225.7/api/auth/token',
      updatepass:   'http://173.212.225.7/api/auth/updatepassword',
    },
    steam: {
      dnl:          'http://173.212.225.7/api/steam/dnl',
      ark:          'http://173.212.225.7/api/steam/ark',
    },
    cms: {
      content:      'http://173.212.225.7/api/cms',
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
