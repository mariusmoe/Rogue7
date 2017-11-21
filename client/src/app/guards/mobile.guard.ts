import { Injectable } from '@angular/core';
import { CanActivate, Router, NavigationStart } from '@angular/router';

import { MobileService } from '@app/services';

@Injectable()
export class MobileGuard implements CanActivate {

  constructor(
    private mobileService: MobileService,
    private router: Router) { }

  /**
   * Dictates the access rights to a given route
   * @return {boolean} whether access is granted
   */
  canActivate() {
    const isMobile = this.mobileService.isMobile();
    // return right away if we cannot activate the route.
    if (!isMobile) { return isMobile; }

    // Set up a subscription such that should the isMobile status ever change whilst
    // on a page guarded by MobileGuard, the user is then taken back to back to
    // default '/' route.
    const mobileSub = this.mobileService.isMobile().subscribe(newIsMobile => {
      if (!newIsMobile) { this.router.navigateByUrl('/'); }
    });
    // Also set up a subscription for whenever navigation starts,
    // and then unsubscribe
    const navSub = this.router.events.subscribe( event => {
      if (event instanceof NavigationStart) {
        mobileSub.unsubscribe(); // cancels out the mobile sub
        navSub.unsubscribe(); // and itself.
      }
    });

    return isMobile;
  }

}
