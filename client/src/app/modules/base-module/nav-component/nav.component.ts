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

  /**
   * Sort arrangement function for CmsContent, CmsFolders and SteamServer, based on either's title.
   * @param  {CmsContent | CmsFolder | SteamServer}   a object to be sorted
   * @param  {CmsContent | CmsFolder | SteamServer}   b object to be sorted
   * @return {number}                                 a's relative position to b.
   */
  private static sortMethod(a: CmsContent | CmsFolder | SteamServer, b: CmsContent | CmsFolder | SteamServer): number {
    return a.title.localeCompare(b.title);
  }

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
      serverList.sort(NavComponent.sortMethod);
      this.steamServersSubject.next(serverList);
    });
  }

  /**
   * Creates and organizes the navigation tree from the CmsContent list provided
   * @param  {CmsContent[]} contentList the CmsContent list to create the nav tree from
   */
  private updateContentList(contentList: CmsContent[]) {
    if (!contentList) { return; }

    const rootContent: CmsContent[] = [];
    const folders: CmsFolder[] = [];
    for (const content of contentList.filter( c => c.nav )) {
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
    rootContent.sort(NavComponent.sortMethod);
    folders.sort(NavComponent.sortMethod);
    for (const folder of folders) { folder.content.sort(NavComponent.sortMethod); }
    // Push
    this.contentSubject.next({
      rootContent: rootContent,
      folders: folders
    });
  }

  /**
   * Helper function for angular's *ngFor
   * @param  {number}                   index the index of the item to track
   * @param  {CmsContent | CmsFolder}   item the item tracked
   * @return {string}                   the item's ID; used for tracking
   */
  trackBy(index: number, item: CmsContent | CmsFolder): string {
    return item._id;
  }
}
