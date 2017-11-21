import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';

import { AccessRoles } from '@app/models';
import { AuthService, CMSService } from '@app/services';

@Injectable()
export class CMSGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private cmsService: CMSService) { }


  /**
   * Dictates the access rights to a given route
   * @return {boolean} whether access is granted
   */
  canActivate(route: ActivatedRouteSnapshot) {
    if (!this.cmsService.getContentList().getValue()) {
      return true; // initial load we don't know yet.
    }
    const contentPage = this.cmsService.getContentList().getValue().find(content => content.route === route.url.join('/'));
    if (contentPage.access === AccessRoles.everyone) { return true; }

    return !this.authService.jwtIsExpired(localStorage.getItem('token')) &&
      (this.authService.isUserOfRole(contentPage.access) ||
      this.authService.isUserOfRole(AccessRoles.admin));
  }

}
