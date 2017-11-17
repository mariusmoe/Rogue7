import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '@env';
import { GameDig, SteamServer } from '@app/models';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { timeout } from 'rxjs/operators';

const TIMEOUT = 5000;

@Injectable()
export class SteamService {
  // Remembers one server at a time
  private serverData = new BehaviorSubject<GameDig>(null);


  constructor(
    private http: HttpClient,
    private router: Router) {
  }

  /**
   * Get the stored server data
   * @return {BehaviorSubject<GameDig>} the stored server data
   */
  getServerData(): BehaviorSubject<GameDig> {
    return this.serverData;
  }

  /**
   * Query for all steam servers
   */
  requestSteamServers(): Observable<SteamServer[]> {
    return this.http.get<SteamServer[]>(environment.URL.steam.servers).pipe(timeout(TIMEOUT));
  }

  /**
   * Query the server for updated Steam Server data
   * @param  {string} route the route assgined for the steam server
   */
  requestSteamServer(route: string): Observable<SteamServer> {
    return this.http.get<SteamServer>(environment.URL.steam.servers + '/' + route).pipe(timeout(TIMEOUT));
  }

  /**
   * Query the server for updated Steam Server data
   * @param  {string} route the route assgined for the steam server
   */
  querySteamServerData(route: string) {
    this.http.get<GameDig>(environment.URL.steam.servers + '/' + route + '/data').pipe(
      timeout(TIMEOUT)
    ).subscribe(
        data => {
          data.lastUpdate = new Date();
          const now = new Date().valueOf();
          for (const player of data.players) {
            player.timeDate = new Date(now - player.time * 1000);
          }
          console.log(data);
          this.serverData.next(data);
        },
        data => { this.serverData.next(data); }
    );
  }
}
