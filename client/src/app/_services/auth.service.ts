import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { JwtHelper, tokenNotExpired } from 'angular2-jwt';
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
  private jwtHelper: JwtHelper = new JwtHelper();
  private userSubject: BehaviorSubject<User>;

  constructor(
    private http: HttpClient,
    private router: Router ) {
      this.userSubject = new BehaviorSubject(null);

      const token = localStorage.getItem('token');
      if (!token || this.jwtHelper.isTokenExpired(token)) {
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
    const u: User = this.jwtHelper.decodeToken(token);
    if (!u) { return; }
    this.userSubject.next(u);
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

  // ---------------------------------------
  // ------------- HTTP METHODS ------------
  // ---------------------------------------

  /**
   * Requests to log the user in
   * @param  {User} user                   The user to log in
   * @return {Observable<boolean>}         Server's response, as an Observable
   */
  login(user: User): Observable<boolean> {
    const headers = { headers: new HttpHeaders().set('content-type', 'application/json') };
    return this.http.post<UserToken>(environment.URL.auth.login, JSON.stringify(user), headers).pipe(
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
    const headers = { headers: new HttpHeaders().set('Authorization', localStorage.getItem('token')) };
    return this.http.get<UserToken>(environment.URL.auth.token, headers).pipe(
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
    const headers = { headers: new HttpHeaders()
        .set('Authorization', localStorage.getItem('token'))
        .set('content-type', 'application/json')
    };
    return this.http.post<boolean>(environment.URL.auth.updatepass, user, headers).pipe(
      map( () => true),
      timeout(TIMEOUT),
      catchError(err => of(false))
    ); // returns message objects
  }



}
