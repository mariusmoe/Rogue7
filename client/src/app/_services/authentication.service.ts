import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { JwtHelper } from 'angular2-jwt';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

import { User } from '../_models/user';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/timeout';

@Injectable()
export class AuthenticationService {

  public token: string;
  private user: User;
  private jwtHelper: JwtHelper = new JwtHelper();
  /**
   * Constructor Set current user
   */
  constructor(
    private http: Http,
    private router: Router ) {
  }

  /**
   * Log out current user
   */
  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('center');
    this.router.navigate(['/login']);
  }


  /**
   * getCurrentUserObservable
   * @return {BehaviorSubject}      userSub with userdata
   */
  getUser(): User {
    const token = this.getToken();
    if (token) {
      const currentUser = this.decodeToken(token);
      return <User>{
        _id: currentUser._id,
        email: currentUser.email,
        role: currentUser.role
      };
    }
  }

  /**
   * Gets the JWT token from localStorage
   * @return {string} user token if it exists in the local storage. undefined otherwise
   */
  private getToken(): string {
    return localStorage.getItem('token');
  }

  /**
   * Decode JWT token
   * @param  {string} token token as it is stored in localstorage
   * @return {User}         User object
   */
  decodeToken(token): User {
    return this.jwtHelper.decodeToken(token);
  }

  /**
   * Try to get a new JWT
   * @return {boolean} true if JWT was successfully renewed else false
   */
  getNewJWT(): Observable<boolean> {
    const token = this.getToken();
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${token}`);
    const options = new RequestOptions({ headers: headers });
    return this.http.get(environment.URL.renewJWT, options).timeout(2000)
      .map(
        response => {
          if (response.status !== 200) {
            // Error during login
            console.error('can\'t renew JWT');
            return false;
          } else {
            const jsonResponse = response.json();
            if (jsonResponse) {
              localStorage.setItem('token', jsonResponse.token);
              localStorage.setItem('center', jsonResponse.center);
              return true;
            } else {
              return false;
            }
          }
        },
        error => {
          console.error(error.text());
          return false;
        }
      ).catch(e => {
        return Observable.of(false);
      });
  }

  /**
   * Requests to log the user in
   * @param  {string}              email    The user's email
   * @param  {string}              password The user's password
   * @return {Observable<boolean>}          Server's response, as an Observable
   */
  login(email: string, password: string): Observable<boolean> {
      const headers = new Headers({'content-type': 'application/json'});
      const options = new RequestOptions({headers: headers});
      const data = { 'email': email, 'password': password };
      return this.http.post(environment.URL.login, JSON.stringify(data), options)
        .map(
          response => {
            const jsonResponse = response.json();
            if (jsonResponse) {
              localStorage.setItem('token', jsonResponse.token);
              localStorage.setItem('center', jsonResponse.center);
              //
              return true;
            } else {
              return false;
            }
          },
          error => {
            console.error(error.text());
            return error.json();
          }
        );
  }

  /**
   * Requests to register a user
   * @param  {string}              email    The email of the user
   * @param  {string}              password The password of the user
   * @param  {string}              link     The referral link that was used
   * @return {Observable<boolean>}          Server's response, as an Observable
   */
  registerUser(email: string, password: string, link: string): Observable<boolean> {
      const headers = new Headers({'content-type': 'application/json'});
      const options = new RequestOptions({headers: headers});
      const data = { 'email': email, 'password': password, 'referral_string': link };
      return this.http.post(environment.URL.newUser, JSON.stringify(data), options)
        .map(
          response => {
            const jsonResponse = response.json();
            // console.log(jsonResponse);
            return true;
          },
          error => {
            console.error(error.text());
            return false;
          }
        );
  }

}
