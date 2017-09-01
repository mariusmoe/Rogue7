import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
// import { MdSnackBar } from '@angular/material';

import { DNLService } from './../../../_services/dnl.service';

import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { interval } from 'rxjs/Observable/interval';
import 'rxjs/add/operator/takeUntil';

import { GameDig, GameDigStates } from './../../../_models/gamedig';


@Component({
  selector: 'app-dnlserver-component',
  templateUrl: './dnlserver.component.html',
  styleUrls: ['./dnlserver.component.scss'],
})
export class DNLServerComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject();
  public GameDigStates = GameDigStates;
  public state = GameDigStates.Loading;

  public gameData: GameDig;
  public lastUpdate: Date;

  constructor(
    private router: Router,
    // public snackBar: MdSnackBar,
    private dnlService: DNLService) {
   }

  ngOnInit() {
    this.queryGameServerData();
    // every 30 sec, it asks again.
    interval(30 * 1000).takeUntil(this.ngUnsubscribe).subscribe(() => {
      this.queryGameServerData();
    });
  }


  private queryGameServerData() {
    this.dnlService.queryGameServer().takeUntil(this.ngUnsubscribe).subscribe((response) => {
      this.gameData = response.serverState;
      this.state = response.state;
      this.lastUpdate = new Date();

      if (this.state === GameDigStates.Success) {
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
