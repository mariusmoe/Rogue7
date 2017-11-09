import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

import { User, UpdatePasswordUser, UserToken } from '../_models/user';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { map, catchError, timeout } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';


const TIMEOUT = 5000;


@Injectable()
export class AuthService {
  private userSubject: BehaviorSubject<User>;

  constructor(
    private http: HttpClient,
    private router: Router ) {
      this.userSubject = new BehaviorSubject(null);

      const token = localStorage.getItem('token');
      if (!token || this.jwtIsExpired(token)) {
        // this.logOut();
        return;
      }
      this.updateCurrentUserData(token);
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
    const u: User = this.jwtDecode(token);
    if (!u) { return; }
    this.userSubject.next(u);
  }

  /**
   * Decodes the provided JWT
   * @param  {string} token the JWT to decode
   * @return {User}         The decoded token user
   */
  private jwtDecode(token: string): User {
    return JSON.parse(atob(token.split('.')[1]));
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
  jwtIsExpired(token: string, offset?: number): boolean {
    const date = this.jwtExpirationDate(token);
    // if we can't get a date, we assume its best to say that it has expired.
    if (null === date) { return true; }
    return ((new Date().valueOf() + offset * 1000) > date.valueOf());
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
    return this.http.post<UserToken>(environment.URL.auth.login, JSON.stringify(user)).pipe(
      map( userToken => {
        localStorage.setItem('token', userToken.token);    // Set token
        this.updateCurrentUserData(userToken.token);       // Set user data & Notify subscribers
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
    this.userSubject.next(null);
    this.router.navigate(['/']);
  }



  /**
   * Attempt to renew JWT token
   * @return {Observable<boolean>} wether the JWT was successfully renewed
   */
  renewToken(): Observable<boolean> {
    return this.http.get<UserToken>(environment.URL.auth.token).pipe(
      map( userToken => {
        localStorage.setItem('token', userToken.token);    // Set token
        return !!userToken.token;
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
