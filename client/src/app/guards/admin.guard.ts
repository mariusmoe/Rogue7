import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '@app/services';
import { AccessRoles } from '@app/models';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService) { }


  /**
   * Dictates the access rights to a given route
   * @return {boolean} whether access is granted
   */
  canActivate() {
    const isExpired = this.authService.jwtIsExpired(localStorage.getItem('token'));
    return !isExpired && this.authService.isUserOfRole(AccessRoles.admin);
  }

}
