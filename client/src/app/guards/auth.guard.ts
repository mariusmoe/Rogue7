import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '@app/services';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService) { }


  /**
   * Dictates the access rights to a given route
   * @return {boolean} whether access is granted
   */
  canActivate() {
    const user = this.authService.getUser().getValue();
    const isExpired = this.authService.jwtIsExpired(localStorage.getItem('token'));
    return user && !isExpired;
  }

}