import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
// import { MdSnackBar } from '@angular/material';

import { DNLService } from './../../../_services/dnl.service';

import { GameDig } from './../../../_models/dnl';

import { Subject } from 'rxjs/Subject';
import { interval } from 'rxjs/Observable/interval';
import 'rxjs/add/operator/takeUntil';

@Component({
  selector: 'app-dnlserver-component',
  templateUrl: './dnlserver.component.html',
  styleUrls: ['./dnlserver.component.scss'],
})
export class DNLServerComponent implements OnDestroy {
  private ngUnsubscribe = new Subject();

  constructor(public dnlService: DNLService) {
    // every 30 sec, it asks again.
    interval(30 * 1000).takeUntil(this.ngUnsubscribe).subscribe(() => {
      dnlService.queryGameServer();
    });
    dnlService.queryGameServer();
   }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


}
