const AuthenticationController = require('./controllers/authentication'),
      ErrorController = require('./controllers/error'),
      GameController = require('./controllers/gamedig'),
      express = require('express'),
      passportService = require('./libs/passport'),
      passport = require('passport'),
      config = require('config'),
      path = require('path');


// Require login/auth
const requireAuth   = passport.authenticate('jwt', { session: false });
const requireLogin  = passport.authenticate('local', { session: false });

// Role types enum: ['sysadmin', 'user'],
const REQUIRE_SYSADMIN = "sysadmin",
      REQUIRE_USER = "user";

module.exports = (app) => {
  // route groups
  const apiRoutes  = express.Router(),
        authRoutes = express.Router(),
        gameRoutes = express.Router();
  // Set auth and game routes as subgroup to apiRoutes
  apiRoutes.use('/auth', authRoutes);
  apiRoutes.use('/game', gameRoutes);
  // Set a common fallback for /api/*; 404 for invalid route
  apiRoutes.all('*', ErrorController.error);

  /*
   |--------------------------------------------------------------------------
   | Auth routes
   |--------------------------------------------------------------------------
  */

  // Register a user
  authRoutes.post('/register', AuthenticationController.register);

  // Login a user
  authRoutes.post('/login', requireLogin, AuthenticationController.login);

  // get a referral link - requires admin rights
  // authRoutes.get('/get_referral_link/:role/:centerId',
  //                requireAuth,
  //                AuthenticationController.roleAuthorization(REQUIRE_SYSADMIN),
  //                AuthenticationController.getReferralLink);

 // if (config.util.getEnv('NODE_ENV') !== 'production') {
 //     authRoutes.post('/register_developer', AuthenticationController.register_developer);
 //     authRoutes.post('/register_testdata', AuthenticationController.register_testdata);
 // }

  // Request a new token
  authRoutes.get('/get_token', requireAuth, AuthenticationController.getJWT);

  // Delete the account with the provided JWT
  authRoutes.delete('/delete_account',
                    requireAuth,
                    AuthenticationController.roleAuthorization(REQUIRE_SYSADMIN),
                    AuthenticationController.deleteAccount);

  // Return all users to superadmin
  // authRoutes.get('/all_users',
  //                   requireAuth,
  //                   AuthenticationController.roleAuthorizationUp(REQUIRE_SYSADMIN),
  //                   AuthenticationController.getAllUsers);

  // // TODO Password reset request route
  // authRoutes.post('/forgot-password', AuthenticationController.forgotPassword);
  //
  // // TODO send mail with token
  // authRoutes.post('/reset-password/:token', AuthenticationController.verifyToken);
  //
  // Change password from within app
  // authRoutes.post('/change_password', requireAuth, AuthenticationController.changePassword);
  //
  // // Confirm account from link sent with email
  // authRoutes.post('/confirm_account/:confirmation_string', AuthenticationController.confirmAccount);
  //
  // // Request new email
  // authRoutes.post('/request_new_email_confirmation', AuthenticationController.newConfirmationLink)
  //

  //
  // change email for this account
  // authRoutes.post('/change_email', requireAuth, AuthenticationController.changeEmail);

  /*
   |--------------------------------------------------------------------------
   | Game routes
   |--------------------------------------------------------------------------
  */


  gameRoutes.get('/query', GameController.getServerData);

  app.use('/api', apiRoutes);
};
