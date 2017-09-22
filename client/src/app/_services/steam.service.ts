import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

import { GameDig } from './../_models/dnl';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SteamService {
  private dnlData = new BehaviorSubject<GameDig>(null);
  private arkData = new BehaviorSubject<GameDig>(null);


  constructor(
    private http: HttpClient,
    private router: Router) {
  }

  /**
   * Get the stored DNL data
   * @return {BehaviorSubject<GameDig>} the stored DNL data
   */
  getDNLData(): BehaviorSubject<GameDig> {
    return this.dnlData;
  }

  /**
   * Query the server for updated DNL data
   */
  queryDNLServer() {
    this.http.get(environment.URL.steam.dnl)
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
          this.dnlData.next(data);
        },
        data => { this.dnlData.next(data); }
    );
  }

  /**
   * Get the stored ARK data
   * @return {BehaviorSubject<GameDig>} the stored DNL data
   */
  getARKData(): BehaviorSubject<GameDig> {
    return this.arkData;
  }

  /**
   * Query the server for updated DNL data
   */
  queryARKServer() {
    this.http.get(environment.URL.steam.ark)
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
          this.arkData.next(data);
        },
        data => { this.arkData.next(data); }
    );
  }
}
