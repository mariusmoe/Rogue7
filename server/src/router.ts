import { Express, Router } from 'express';
import { util as configUtil } from 'config';

// Passport
import { authenticate } from 'passport';
import { PassportConfig } from './libs/passportConfig';

// Controllers
import { AuthController } from './controllers/auth';
import { CMSController } from './controllers/cms';
import { DNLController } from './controllers/dnl';
import { ErrorController } from './controllers/error';



// Require login/auth


export class AppRouter {

  /**
   * Initiates a route
   * @param  {Express} app expressModule
   */
  public static initiate(app: Express) {
    // Set up PassportConfig first
    PassportConfig.initiate();

    const apiRoutes = Router();
    app.use('/api', apiRoutes);
    this.authRoutes(apiRoutes);
    this.cmsRoutes(apiRoutes);
    this.dnlRoutes(apiRoutes);
    // Set a common fallback for /api/*; 404 for invalid route
    apiRoutes.all('*', ErrorController.error);

    console.log('[Router] completed');
  }



  /**
   * Init Auth routes
   * @param  {Router} router the parent router
   */
  private static authRoutes(router: Router) {
    const authRoutes = Router();

    // Register a user
    if (configUtil.getEnv('NODE_ENV') !== 'production') {
      authRoutes.post('/register', AuthController.register);
    }

    // Login a user
    authRoutes.post('/login', PassportConfig.requireLogin, AuthController.token); // requireLogin here. Intended.

    // Request a new token
    authRoutes.get('/token', PassportConfig.requireAuth, AuthController.token); // requireAuth here. Intended.

    // Request to update password
    authRoutes.post('/updatepassword', PassportConfig.requireAuth, AuthController.updatePassword);

    // assign to parent router
    router.use('/auth', authRoutes);
  }



  /**
   * Init CMS routes
   * @param  {Router} router the parent router
   */
  private static cmsRoutes(router: Router) {
    const cmsRoutes = Router();

    // Get content lists
    cmsRoutes.get('/', CMSController.getContentList);

    // Get content
    cmsRoutes.get('/:route', CMSController.getContent);

    // Patch content
    cmsRoutes.patch('/:route', PassportConfig.requireAuth, CMSController.patchContent);

    // Delete content
    cmsRoutes.delete('/:route', PassportConfig.requireAuth, CMSController.deleteContent);

    // Create content
    cmsRoutes.post('/', PassportConfig.requireAuth, CMSController.createContent);


    // assign to parent router
    router.use('/cms', cmsRoutes);
  }


  private static dnlRoutes(router: Router) {
    const dnlRoutes = Router();
    dnlRoutes.get('/query', DNLController.getServerData);

    // assign to parent router
    router.use('/dnl', dnlRoutes);
  }


}
