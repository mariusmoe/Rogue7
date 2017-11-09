import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';

import { AuthService } from '../../../_services/auth.service';
import { CMSService } from '../../../_services/cms.service';
import { SteamService } from '../../../_services/steam.service';

import { CmsContent, CmsFolder } from '../../../_models/cms';
import { SteamServer } from '../../../_models/steam';

import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-base-component',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();

  contentSubject = new BehaviorSubject(null);
  steamServersSubject = new BehaviorSubject<SteamServer[]>(null);

  @ViewChild('sidenavLeft') private sidenavLeft: any;
  @ViewChild('sidenavRight') private sidenavRight: any;
  isMobile = new BehaviorSubject<boolean>(false);
  private mobileDevices = [
    Breakpoints.Handset
  ];

  constructor(
    public authService: AuthService,
    public cmsService: CMSService,
    public steamService: SteamService,
    private iconRegistry: MatIconRegistry,
    private san: DomSanitizer,
    private breakpointObserver: BreakpointObserver,
    private router: Router) {
    // Register logo
    iconRegistry.addSvgIcon('logo', san.bypassSecurityTrustResourceUrl('assets/logo256.svg'));

    // Handle Mobile devices
    if (breakpointObserver.isMatched(this.mobileDevices)) { this.isMobile.next(true); }

    // Subscribe to content updates
    const sortMethod = (a, b) => { if (a.title > b.title) { return 1; } if (a.title < b.title) { return -1; } return 0; };
    cmsService.getContentList().pipe(takeUntil(this.ngUnsubscribe)).subscribe( contentList => {
      if (!contentList) { return; }
      const rootContent: CmsContent[] = [];
      const folders: CmsFolder[] = [];
      for (const content of contentList) {
        if (!content.folder) {
          rootContent.push(content);
          continue;
        }
        const folder = folders.find(f => f.title === content.folder);
        if (!folder) {
          folders.push({
            'title': content.folder,
            'content': [content],
          });
          continue;
        }
        folder.content.push(content);
      }
      // sort
      rootContent.sort(sortMethod);
      folders.sort(sortMethod);
      for (const folder of folders) { folder.content.sort(sortMethod); }
      // Push
      this.contentSubject.next({
        rootContent: rootContent,
        folders: folders
      });
    });

    // Subscribe to steam server updates
    steamService.requestSteamServers().pipe(takeUntil(this.ngUnsubscribe)).subscribe( serverList => {
      if (!serverList) { return; }
      this.steamServersSubject.next(serverList);
    });
  }

  ngOnInit() {
    // Close the sidenav upon navigation
    this.router.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe(e => {
      this.sidenavLeft.close();
      this.sidenavRight.close();
    });
    // Handle Mobile breakpoint change
    this.breakpointObserver.observe(this.mobileDevices).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (!result.matches) {
        this.sidenavLeft.close();
        this.sidenavRight.close();
      }
      this.isMobile.next(result.matches);
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
