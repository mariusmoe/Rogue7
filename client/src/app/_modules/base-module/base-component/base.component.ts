import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

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
export class BaseComponent implements OnDestroy {
  private ngUnsubscribe = new Subject();

  contentSubject = new Subject();
  steamServersSubject = new BehaviorSubject<SteamServer[]>(null);

  constructor(
    public authService: AuthService,
    public cmsService: CMSService,
    public steamService: SteamService) {

      // https://material.angular.io/cdk/layout/overview

    const sortMethod = (a, b) => { if (a.title > b.title) { return 1; } if (a.title < b.title) { return -1; } return 0; };

    // Subscribe to content updates
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

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
