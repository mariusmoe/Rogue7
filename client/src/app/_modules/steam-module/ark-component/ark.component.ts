import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import { SteamService } from './../../../_services/steam.service';

import { GameDig } from './../../../_models/dnl';

import { Subject } from 'rxjs/Subject';
import { interval } from 'rxjs/observable/interval';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ark-component',
  templateUrl: './ark.component.html',
  styleUrls: ['./ark.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ARKComponent implements OnDestroy {
  private ngUnsubscribe = new Subject();

  constructor(public steamService: SteamService) {
    // every 30 sec, it asks again.
    interval(30 * 1000).pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      steamService.queryARKServer();
    });
    steamService.queryARKServer();
   }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


}
