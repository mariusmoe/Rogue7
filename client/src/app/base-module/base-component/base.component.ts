import { Component, OnInit, OnDestroy } from '@angular/core';

import { AuthService } from '../../_services/auth.service';

import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';


@Component({
  selector: 'app-base-component',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
})
export class BaseComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();

  public nav: [{'name': string, 'url': string }];

  constructor(
    private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.getUser().takeUntil(this.ngUnsubscribe).subscribe(user => {
      // f
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
