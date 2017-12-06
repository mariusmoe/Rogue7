import { Component, ChangeDetectionStrategy, ViewChild, Optional, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

import { MobileService, AuthService, WorkerService } from '@app/services';

import { interval } from 'rxjs/observable/interval';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-base-component',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  @ViewChild('sidenavLeft') private sidenavLeft: any;
  @ViewChild('sidenavRight') private sidenavRight: any;
  public loadingBarValue = new Subject<number>();
  private loadingBarSub: Subscription;

  constructor(
    @Optional() private workerService: WorkerService,
    public mobileService: MobileService,
    public authService: AuthService,
    public router: Router,
    private iconRegistry: MatIconRegistry,
    private san: DomSanitizer) {
    // Register logo
    iconRegistry.addSvgIcon('logo', san.bypassSecurityTrustResourceUrl('assets/logo256.svg'));
  }

  ngOnInit() {
    this.mobileService.isMobile().pipe(takeUntil(this.ngUnsubscribe)).subscribe(isMobile => {
      if (!isMobile) { this.closeSideNavs(); }
    });
    this.router.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe(e => {
      this.closeSideNavs();

      if (e instanceof NavigationStart) {
        this.loadingBarValue.next(0);

        if (this.loadingBarSub) { this.loadingBarSub.unsubscribe(); }

        this.loadingBarSub = interval(100).subscribe(num => { // every 100ms
          this.loadingBarValue.next(Math.min(90, num * 10));
        });
      } else if (e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError) {
        if (this.loadingBarSub) { this.loadingBarSub.unsubscribe(); }

        this.loadingBarValue.next(100); // 100 = max
      }
    });
  }

  /**
   * Closes the Mobile navigation sidepanels
   */
  closeSideNavs() {
    this.sidenavLeft.close();
    this.sidenavRight.close();
  }
}
