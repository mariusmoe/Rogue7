import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import { SteamService } from './../../../_services/steam.service';

import { GameDig } from './../../../_models/dnl';

import { Subject } from 'rxjs/Subject';
import { interval } from 'rxjs/observable/interval';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dnl-component',
  templateUrl: './dnl.component.html',
  styleUrls: ['./dnl.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DNLComponent implements OnDestroy {
  private ngUnsubscribe = new Subject();

  constructor(public steamService: SteamService) {
    // every 30 sec, it asks again.
    interval(30 * 1000).pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      steamService.queryDNLServer();
    });
    steamService.queryDNLServer();
   }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


}