import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  private jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    public snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService) { }


  /**
   * Dictates the access rights to a given route
   * @return {boolean} whether access is granted
   */
  canActivate() {
    if (!this.authService.getUser().getValue()) {
      // not logged in so redirect to login page
      // this.router.navigate(['/login']);
      return false;
    }

    // User might be logged in
    const expDate = this.getTokenExpirationDate().getTime();
    const now = new Date().getTime();
    const warningTime = expDate - 60 * 60 * 1000;     // 60 min before expDate
    if (now > expDate) {
      this.openSnackBar('Session expired', '');
      this.authService.logOut();
      return false;
    }

    // At this point we know that the user is logged in.
    // Anything below here should return true

    if (warningTime < now) {
      // We know because of the prior if check that we're BEFORE the expiry Date
      // so if now is further ahead than the warn time, we're within the 60 min
      // window, and thusly should query for a renewal of the token.
      const sub = this.authService.renewToken().subscribe(result => {
        sub.unsubscribe();
        if (result === false) {
          // Session expired
          console.log('session expired due to renewToken');
          this.openSnackBar('Session expired', '');
          this.authService.logOut();
        }
      });
    }
    return true;
  }

  /**
   * Returns the expiry date of the JWT
   * @return {Date} the date time the JWT expires
   */
  private getTokenExpirationDate(): Date {
    const token = localStorage.getItem('token');
    if (token) {
      return this.jwtHelper.getTokenExpirationDate(token);
    }
    return new Date(); // now
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
