import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material';

import { environment } from '@env';
import { User, UpdatePasswordUser, UserToken, AccessRoles } from '@app/models';

import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { map, catchError, timeout, takeUntil } from 'rxjs/operators';
import { timer } from 'rxjs/observable/timer';
import { of } from 'rxjs/observable/of';


const TIMEOUT = 5000;


@Injectable()
export class AuthService {
  private userSubject = new BehaviorSubject(null);
  private renewalSub: Subscription;

  constructor(
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private router: Router ) {

      const token = localStorage.getItem('token');
      if (!token || this.jwtIsExpired(token)) {
        localStorage.removeItem('token');
        return;
      }
      this.updateCurrentUserData(token);
      this.engageRenewTokenTimer(token);
  }

  // ---------------------------------------
  // --------------- HELPERS ---------------
  // ---------------------------------------

  /**
   * Updates the user data field by decoding the JWT token
   * @param  {string} token the JWT token to decode
   */
  private updateCurrentUserData(token: string) {
    if (!token) { return; }
    const u = this.jwtDecode(token);
    if (!u) { return; }
    this.userSubject.next(u);
  }

  /**
   * Decodes the provided JWT
   * @param  {string} token the JWT to decode
   * @return {User}         The decoded token user
   */
  private jwtDecode(token: string): User {
    return token ? JSON.parse(atob(token.split('.')[1])) : null;
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

  /**
   * Starts a timer to renew the jwt before it exires
   * @param  {string}       token token to base the renewal timer on
   */
  private engageRenewTokenTimer(token: string) {
    // cancel any ongoing timers
    if (this.renewalSub) { this.renewalSub.unsubscribe(); }
    // Log out the user if it is too late to renew.
    if (this.jwtIsExpired(token)) {  this.logOut(); return; }
    // Engage a new timer to go off 20 minutes before expiration token
    const renewalDate = new Date(this.jwtExpirationDate(token).getTime() - 1000 * 60 * 20);
    this.renewalSub = timer(renewalDate).subscribe( time => {
      const sub = this.renewToken().subscribe(userToken => {
        sub.unsubscribe();
        if (userToken.token) {
          this.engageRenewTokenTimer(userToken.token);
          return;
        }
        this.openSnackBar('Session expired', '');
        this.logOut();
      });
    });
  }

  // ---------------------------------------
  // -------------- UTILITIES --------------
  // ---------------------------------------

  /**
   * Gets the user as an observable
   * @return {BehaviorSubject<User>}    the user Subject
   */
  getUser(): BehaviorSubject<User> {
    return this.userSubject;
  }

  /**
   * Returns the expiration date of a token
   * @param  {string} token the token to get the expiration date of
   * @return {Date}         the date the token expires
   */
  jwtExpirationDate(token: string): Date {
    const user = this.jwtDecode(token);
    if (!user || !user.hasOwnProperty('exp')) { return null; }

    const date = new Date(0);
    date.setUTCSeconds(user.exp);
    return date;
  }

  /**
   * Returns true if the token has expired
   * @param  {string}  token  the token to check the expiration date of
   * @param  {number}  offset number of seconds offset from now
   * @return {boolean}        whether the token has expired
   */
  jwtIsExpired(token: string, offset: number = 0): boolean {
    const date = this.jwtExpirationDate(token);
    // if we can't get a date, we assume its best to say that it has expired.
    if (null === date) { return true; }
    return ((new Date().valueOf() + offset * 1000) > date.valueOf());
  }

  /**
   * Returns true if the user is of the given role
   * @param  {AccessRoles}      role The role to compare against
   * @return {boolean}          whether the user is of the given role
   */
  isUserOfRole(role: AccessRoles): boolean {
    const user = this.getUser().getValue();
    return user && user.role === role;
  }

  // ---------------------------------------
  // ------------- HTTP METHODS ------------
  // ---------------------------------------

  /**
   * Requests to log the user in
   * @param  {User} user                   The user to log in
   * @return {Observable<boolean>}         Server's response, as an Observable
   */
  login(user: User): Observable<boolean> {
    return this.http.post<UserToken>(environment.URL.auth.login, user).pipe(
      map( userToken => {
        // Set token
        localStorage.setItem('token', userToken.token);
        // Engage token renewal timer
        this.engageRenewTokenTimer(userToken.token);
        // Set user data & Notify subscribers
        this.updateCurrentUserData(userToken.token);
        return !!userToken.token;
      }),
      timeout(TIMEOUT)
    );
  }


  /**
   * Log out current user
   */
  logOut() {
    localStorage.removeItem('token');
    if (this.renewalSub) { this.renewalSub.unsubscribe(); }
    this.userSubject.next(null);
    this.router.navigateByUrl('/');
  }



  /**
   * Attempt to renew JWT token
   * @return {Observable<boolean>} wether the JWT was successfully renewed
   */
  renewToken(): Observable<UserToken> {
    return this.http.get<UserToken>(environment.URL.auth.token).pipe(
      map( userToken => {
        localStorage.setItem('token', userToken.token);    // Set token
        return userToken;
      }),
      timeout(TIMEOUT)
    );
  }

  /**
   * Attempt to update the logged in user's password
   * @param  {UpdatePasswordUser}  user the object containing the user data
   * @return {Observable<boolean>}      wether the password was successfully updated
   */
  updatePassword(user: UpdatePasswordUser): Observable<boolean> {
    return this.http.post<boolean>(environment.URL.auth.updatepass, user).pipe(
      map( () => true),
      timeout(TIMEOUT),
      catchError(err => of(false))
    ); // returns message objects
  }



}
