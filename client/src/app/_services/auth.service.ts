import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

import { User, UpdatePasswordUser } from '../_models/user';
import { JWT } from '../_models/jwt';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/timeout';


const TIMEOUT = 2000;


@Injectable()
export class AuthService {
  public token: string;
  private jwtHelper: JwtHelper = new JwtHelper();

  private userSubject: BehaviorSubject<User>;

  constructor(
    private http: HttpClient,
    private router: Router ) {
      this.userSubject = new BehaviorSubject(null);
      this.updateCurrentUserData(localStorage.getItem('token'));
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
    const u = this.jwtHelper.decodeToken(token);
    if (!u) { return; }
    this.userSubject.next({ _id: u._id, email: u.email, role: u.role });
  }

  // ---------------------------------------
  // -------------- UTILITIES --------------
  // ---------------------------------------

  /**
   * Gets the user as an observable
   * @return {Observable<User>}    the user observable
   */
  getUser(): Observable<User> {
    return this.userSubject.asObservable();
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
    return this.http.post(environment.URL.auth.login, JSON.stringify(user), headers).map( (json: JWT) => {
      localStorage.setItem('token', json.token);    // Set token
      this.updateCurrentUserData(json.token);       // Set user data & Notify subscribers
      return !!json.token;

    }).timeout(TIMEOUT).catch(err => {
      // essentially, IF we catch due to a HTTP status code >= 400
      if (err && err.status && err.status >= 400) {
        return Observable.of(false);  // We want to send a basic false.
      }
      return Observable.throw(false); // If we time out, however, we want to throw the false.
    });
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
    return this.http.get(environment.URL.auth.token, headers).map( (json: JWT) => {
      localStorage.setItem('token', json.token);
      return !!json.token;
    }).timeout(TIMEOUT).catch(err => {
      // essentially, IF we catch due to a HTTP status code >= 400
      if (err && err.status && err.status >= 400) {
        return Observable.of(false);  // We want to send a basic false.
      }
      return Observable.throw(false); // If we time out, however, we want to throw the false.
    });
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
    return this.http.post(environment.URL.auth.updatepass, user, headers).map( () => {
      return true;
    }).timeout(TIMEOUT).catch(err => {
      // essentially, IF we catch due to a HTTP status code >= 400
      if (err && err.status && err.status >= 400) {
        return Observable.of(false);  // We want to send a basic false.
      }
      return Observable.throw(false); // If we time out, however, we want to throw the false.
    });
  }



}
