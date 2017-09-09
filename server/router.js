const AuthenticationController = require('./controllers/authentication'),
      ErrorController = require('./controllers/error'),
      DNLController = require('./controllers/dnl'),
      CMSController = require('./controllers/cms'),
      express = require('express'),
      passportService = require('./libs/passport'),
      passport = require('passport'),
      config = require('config'),
      path = require('path');


// Require login/auth
const requireLogin  = passport.authenticate('local',          { session: false });
const requireAuth   = passport.authenticate('fullAuth',       { session: false });
const requireAccess = passport.authenticate('cmsAccessAuth',  { session: false });

// Role types enum: ['admin', 'user'],
const REQUIRE_ADMIN = "admin",
      REQUIRE_USER = "user";

module.exports = (app) => {
  // route groups
  const apiRoutes  = express.Router(),
        authRoutes = express.Router(),
        cmsRoutes = express.Router(),
        dnlRoutes = express.Router();
  // Set auth and game routes as subgroup to apiRoutes
  apiRoutes.use('/auth', authRoutes);
  apiRoutes.use('/dnl', dnlRoutes);
  apiRoutes.use('/cms', cmsRoutes);
  // Set a common fallback for /api/*; 404 for invalid route
  apiRoutes.all('*', ErrorController.error);

  /*
   |--------------------------------------------------------------------------
   | Auth routes
   |--------------------------------------------------------------------------
  */

  // Register a user
  if (config.util.getEnv('NODE_ENV') !== 'production') {
    authRoutes.post('/register', AuthenticationController.register);
  }

  // Login a user
  authRoutes.post('/login', requireLogin, AuthenticationController.login);


  // Request a new token
  authRoutes.get('/token', requireAuth, AuthenticationController.token);


  // Request to update password
  authRoutes.post('/updatepassword', requireAuth, AuthenticationController.updatepassword);


  /*
   |--------------------------------------------------------------------------
   | CMS routes
   |--------------------------------------------------------------------------
  */

  // Get content lists
  cmsRoutes.get('/', requireAccess, CMSController.getContentList);


  // Get content
  cmsRoutes.get('/:route', requireAccess, CMSController.getContent);


  // Patch content
  cmsRoutes.patch('/:route', requireAuth, CMSController.patchContent);


  // Delete content
  cmsRoutes.delete('/:route', requireAuth, CMSController.deleteContent);


  // Create content
  cmsRoutes.post('/', requireAuth, CMSController.createContent);





  /*
   |--------------------------------------------------------------------------
   | DNL routes
   |--------------------------------------------------------------------------
  */


  dnlRoutes.get('/query', DNLController.getServerData);

  app.use('/api', apiRoutes);
};
