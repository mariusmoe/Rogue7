import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

import { GameDig } from './../_models/dnl';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DNLService {
  private dataSubject = new BehaviorSubject<GameDig>(null);


  constructor(
    private http: HttpClient,
    private router: Router) {
  }

  getServerData(): BehaviorSubject<GameDig> {
    return this.dataSubject;
  }

  queryGameServer() {
    this.http.get(environment.URL.dnl.query)
      .map( (data: GameDig) => data)
      .timeout(5000)
      .subscribe(
        data => {
          data.lastUpdate = new Date();
          const now = new Date().valueOf();
          for (const player of data.players) {
            player.timeDate = new Date(now - player.time * 1000);
          }
          console.log(data);
          this.dataSubject.next(data);
        },
        data => { this.dataSubject.next(data); }
    );
  }
}
