import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

import { CMSRoutes } from '../_models/CMSRoutes';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/timeout';


const TIMEOUT = 2000;


@Injectable()
export class CMSService {


  private cmsRoutesSubject: BehaviorSubject<CMSRoutes>;

  constructor(
    private http: HttpClient,
    private router: Router ) {
      this.cmsRoutesSubject = new BehaviorSubject(null);
      // this.updateCurrentUserData(localStorage.getItem('token'));
  }



  // ---------------------------------------
  // -------------- UTILITIES --------------
  // ---------------------------------------

  /**
   * Gets the cmsRoutes as an observable
   * @return {Observable<CMSRoutes>}    the CMSRoutes observable
   */
  getCMSRoutes(): Observable<CMSRoutes> {
    return this.cmsRoutesSubject.asObservable();
  }

  // ---------------------------------------
  // ------------- HTTP METHODS ------------
  // ---------------------------------------

  /**
   * Requests the CMS routes
   * @return {Observable<boolean>}         Server's response, as an Observable
   */
  requestCMSRoutes(): Observable<CMSRoutes> {
    const headers = { headers: new HttpHeaders().set('Authorization', localStorage.getItem('token')) };
    return this.http.get(environment.URL.auth.login, headers).map( (json: any) => {

      return !!json.token;

    }).timeout(TIMEOUT).catch(err => {
      // essentially, IF we catch due to a HTTP status code >= 400
      if (err && err.status && err.status >= 400) {
        return Observable.of(null);  // We want to send a basic null.
      }
      return Observable.throw(null); // If we time out, however, we want to throw the null.
    });
  }




}
