import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

import { interval } from 'rxjs/observable/interval';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { takeUntil, map } from 'rxjs/operators';

@Component({
  selector: 'app-loadingbar-component',
  templateUrl: './loadingbar.component.html',
  styleUrls: ['./loadingbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingbarComponent implements OnInit {
  private ngUnsubscribe = new Subject();

  public loadingBarValue = new Subject<number>();
  public loadingBarVisible = new Subject<boolean>();

  private loadingBarSub: Subscription;

  constructor(public router: Router) {}

  ngOnInit() {
    this.router.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe(e => {
      if (e instanceof NavigationStart) {
        this.loadingBarValue.next(0);

        if (this.loadingBarSub) { this.loadingBarSub.unsubscribe(); }

        this.loadingBarSub = interval(100).subscribe(num => { // every 100ms
          if (num === 1) { this.loadingBarVisible.next(true); }
          this.loadingBarValue.next(Math.min(90, num * 10));
        });
      } else if (e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError) {
        if (this.loadingBarSub) { this.loadingBarSub.unsubscribe(); }

        this.loadingBarValue.next(100); // 100 = max
        this.loadingBarVisible.next(false);
      }
    });
  }

}
