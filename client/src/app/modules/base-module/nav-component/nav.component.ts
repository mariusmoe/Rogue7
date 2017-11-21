import { Component, ChangeDetectionStrategy } from '@angular/core';

import { CmsContent, CmsFolder, SteamServer } from '@app/models';
import { AuthService, CMSService, SteamService } from '@app/services';

import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-nav-component',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavComponent {
  private ngUnsubscribe = new Subject();

  contentSubject = new BehaviorSubject(null);
  steamServersSubject = new BehaviorSubject<SteamServer[]>(null);

  private sortMethod = (a, b) => { if (a.title > b.title) { return 1; } if (a.title < b.title) { return -1; } return 0; };

  constructor(
    private authService: AuthService,
    private cmsService: CMSService,
    private steamService: SteamService) {

    // Whenever a user logs in or out, do update
    authService.getUser().pipe(takeUntil(this.ngUnsubscribe)).subscribe( user => {
      cmsService.getContentList(true); // force update
      steamService.requestSteamServers();
    });

    // Subscribe to content updates, and keep the subscription until we get a new userSubject.next
    const sub = cmsService.getContentList().pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      contentList => this.updateContentList(contentList)
    );

    // Subscribe to steam server updates
    steamService.requestSteamServers().pipe(takeUntil(this.ngUnsubscribe)).subscribe( serverList => {
      if (!serverList) { return; }
      this.steamServersSubject.next(serverList);
    });
  }


  private updateContentList(contentList: CmsContent[]) {
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
    rootContent.sort(this.sortMethod);
    folders.sort(this.sortMethod);
    for (const folder of folders) { folder.content.sort(this.sortMethod); }
    // Push
    this.contentSubject.next({
      rootContent: rootContent,
      folders: folders
    });
  }
}
