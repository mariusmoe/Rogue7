export const environment = {
  production: true,

  // URL: {
  //   base:           'http://173.212.225.7',
  //   auth: {
  //     login:        'http://173.212.225.7/api/auth/login',
  //     token:        'http://173.212.225.7/api/auth/token',
  //     updatepass:   'http://173.212.225.7/api/auth/updatepassword',
  //   },
  //   dnl: {
  //     query:        'http://173.212.225.7/api/dnl/query',
  //   },
  //   cms: {
  //     route:        'http://173.212.225.7/api/cms',
  //     content:      'http://173.212.225.7/api/cms/content',
  //   },
  // }
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
