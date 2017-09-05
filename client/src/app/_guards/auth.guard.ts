import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';
import { MdSnackBar } from '@angular/material';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  private jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    public snackBar: MdSnackBar,
    private router: Router,
    private authService: AuthService) { }

  /**
   * Defines a time 60 min before the JWT rottens
   * @return {Date} 60 min before rotten JWT
   */
  private getAlarmtime() {
    const token = localStorage.getItem('token');
    const expDate = this.jwtHelper.getTokenExpirationDate(token);

    return new Date(expDate.getTime() * 1000 - 60 * 60000);     // 60 min before expDate
  }

  /**
   * [canActivate description]
   * @return {[type]} [description]
   */
  canActivate() {
    if (localStorage.getItem('token')) {
      // User might be loged in
      const alarmTime = this.getAlarmtime();
      if (alarmTime.getTime() < (new Date().getTime() * 1000)) {
        // check if JWT can be renewed
        const sub = this.authService.renewToken().subscribe(
          result => {
            sub.unsubscribe();
            if (result === false) {
              // Session expired
              this.openSnackBar('Session expired', '');
              this.authService.logOut();
              return false;
            }
            return true;
        });
      } else {
        return true;
      }
    } else {
      // not logged in so redirect to login page
      this.router.navigate(['/login']);
      return false;
    }
  }


  /**
   * Opens a snackbar with the given message and action message
   * @param  {string} message The message that is to be displayed
   * @param  {string} action  the action message that is to be displayed
   */
  private openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

}
