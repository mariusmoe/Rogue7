import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

import { AuthService } from '../../../_services/auth.service';
import { CMSService } from '../../../_services/cms.service';

import { CmsContent, CmsFolder } from '../../../_models/cms';

import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-base-component',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseComponent implements OnDestroy {
  private ngUnsubscribe = new Subject();
  defaultRoutes = [
    {'title': 'ARK Server', route: 'steam/ark' },
    {'title': 'DNL Server', route: 'steam/dnl' },
  ];

  contentSubject = new Subject();

  constructor(
    public authService: AuthService,
    public cmsService: CMSService) {

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
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
