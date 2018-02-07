import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry, MatDrawer } from '@angular/material';
import { Router } from '@angular/router';

import { MobileService, AuthService, WorkerService } from '@app/services';

import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-base-component',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  @ViewChild('sidenavLeft') private sidenavLeft: MatDrawer;
  @ViewChild('sidenavRight') private sidenavRight: MatDrawer;


  constructor(
    public mobileService: MobileService,
    public authService: AuthService,
    public router: Router,
    private workerService: WorkerService,
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
    });
  }

  /**
   * Closes the Mobile navigation sidepanels
   */
  closeSideNavs() {
    this.sidenavLeft.close();
    this.sidenavRight.close();
  }

  toggleLeftNav() {
    this.sidenavLeft.toggle();
    this.sidenavRight.close();
  }

  toggleRightNav() {
    this.sidenavLeft.close();
    this.sidenavRight.toggle();
  }
}
