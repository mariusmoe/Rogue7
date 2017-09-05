import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

import { DNLMessage, DNLStates } from './../_models/dnl';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/timeout';

@Injectable()
export class DNLService {

  constructor(
    private http: HttpClient,
    private router: Router) {
  }

  queryGameServer(): Observable<DNLMessage> {
    return this.http.get(environment.URL.dnl.query).map( (json: DNLMessage) => {
      // all successful responses do not necessarily mean the server is up and running etc.
      if (json.serverState) {
        // may still only have PARTIAL information
        json.state = DNLStates.Success;
      } else if (json.timeout) {
        json.state = DNLStates.TimedOut;
      } else if (json.offline) {
        json.state = DNLStates.Error;
      }
      return json;
    }).timeout(5000).catch(e => {
      return Observable.of({
        message: 'Request timed out',
        state: DNLStates.TimedOut
      });
    });
  }
}
