import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';

import { GameService } from './../../../_services/game.service';

import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { interval } from 'rxjs/Observable/interval';
import 'rxjs/add/operator/takeUntil';

import { GameDig } from './../../../_models/gamedig';

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

  private ngUnsubscribe = new Subject();

  public states = States;
  public state: States;

  public gameData: GameDig;
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
    interval(30 * 1000).takeUntil(this.ngUnsubscribe).subscribe(() => {
      this.queryGameServerData();
    });
  }


  private queryGameServerData() {
    this.gameService.queryGameServer().takeUntil(this.ngUnsubscribe).subscribe((response) => {
      this.gameData = response.serverState;
      this.state = response.timedOut ? States.TimedOut : States.Finished;
      this.lastUpdate = new Date();

      if (this.state === this.states.Finished) {
        const now = new Date().valueOf();
        for (const player of this.gameData.players) {
          player.timeDate = new Date(now - player.time * 1000);
        }
      }
      console.log(response);
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
