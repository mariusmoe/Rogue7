export const environment = {
  production: true,

  URL: {
    base:           'http://173.212.225.7',
    auth: {
      login:        'http://173.212.225.7/api/auth/login',
      token:        'http://173.212.225.7/api/auth/token',
      updatepass:   'http://173.212.225.7/api/auth/updatepassword',
    },
    dnl: {
      query:        'http://173.212.225.7/api/dnl/query',
    },
    cms:            'http://173.212.225.7/api/cms',
  }
};
