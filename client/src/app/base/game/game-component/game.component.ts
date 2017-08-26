import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';

import { GameService } from './../../../_services/game.service';

import { Subscription } from 'rxjs/Subscription';
// import 'rxjs/add/operator/filter';
import { interval } from 'rxjs/Observable/interval';

enum States {
  Loading,
  Finished,
  TimedOut,
}


@Component({
  selector: 'app-game-component',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {

  private gameSub: Subscription;

  public states = States;
  public state: States;

  public gameData;
  public lastUpdate: Date;

  constructor(
    private router: Router,
    public snackBar: MdSnackBar,
    private gameService: GameService) {
      this.state = States.Loading;
   }

  ngOnInit() {
    this.queryGameServerData();
    // every 30 sec, it asks again.
    this.gameSub = interval(30 * 1000).subscribe(() => {
      this.queryGameServerData();
    });
  }


  private queryGameServerData() {
    const sub = this.gameService.queryGameServer().subscribe((response) => {
      this.gameData = response.serverState;
      this.state = response.timedOut ? States.TimedOut : States.Finished;
      this.lastUpdate = new Date();
      console.log(response);
      sub.unsubscribe();
    });
  }

  ngOnDestroy() {
    this.gameSub.unsubscribe();
  }
}
