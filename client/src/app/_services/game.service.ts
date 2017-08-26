import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';


import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/timeout';

@Injectable()
export class GameService {

  /**
   * Constructor Set current user
   */
  constructor(
    private http: Http,
    private router: Router ) {
  }

  queryGameServer(): Observable<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers });
    return this.http.get(environment.URL.queryGameServer, options).timeout(4000)
      .map(
        response => {
          return response.json();
        },
        error => {
          console.error(error.text());
          return false;
        }
      ).catch(e => {
        return Observable.of({ timedOut: true });
      });
  }
}
