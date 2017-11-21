import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '@env';
import { CmsContent } from '@app/models';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { timeout } from 'rxjs/operators';

const TIMEOUT = 5000;


@Injectable()
export class CMSService {

  private listSubject: BehaviorSubject<CmsContent[]> = new BehaviorSubject(null);

  constructor(
    private http: HttpClient,
    private router: Router) {
  }



  // ---------------------------------------
  // -------------- UTILITIES --------------
  // ---------------------------------------

  /**
   * Gets the cmsRoutes as a BehaviorSubject
   * @param  {[boolean]}                        forceUpdate, whether to force update. Defaults to false.
   * @return {BehaviorSubject<CmsContent[]>}    the BehaviorSubject
   */
  getContentList(forceUpdate = false): BehaviorSubject<CmsContent[]> {
    if (forceUpdate) {
      const sub = this.requestContentList().subscribe(
        contentList => {
          sub.unsubscribe();
          this.listSubject.next(contentList);
        }
      );
    }
    return this.listSubject;
  }

  /**
   * Returns the time, in ms, until the http request is timed out.
   * @return {number} the time, in ms.
   */
  getTimeout(): number {
    return TIMEOUT;
  }

  // ---------------------------------------
  // ------------- HTTP METHODS ------------
  // ---------------------------------------



  /**
   * Requests the content list
   * @return {Observable<CmsContent[]>}         Server's response, as an Observable
   */
  private requestContentList(): Observable<CmsContent[]> {
    return this.http.get<CmsContent[]>(environment.URL.cms.content).pipe(timeout(TIMEOUT));
  }


  /**
   * Requests the content from the given url
   * @return {Observable<CmsContent>}         Server's response, as an Observable
   */
  requestContent(contentUrl: string): Observable<CmsContent> {
    return this.http.get<CmsContent>(environment.URL.cms.content + '/' + contentUrl).pipe(timeout(TIMEOUT));
  }

  /**
   * Requests to update the content for a given url
   * @return {Observable<CmsContent>}         Server's response, as an Observable
   */
  updateContent(contentUrl: string, updatedContent: CmsContent): Observable<CmsContent> {
    return this.http.patch<CmsContent>(environment.URL.cms.content + '/' + contentUrl, updatedContent).pipe(timeout(TIMEOUT));
  }

  /**
   * Requests to update the content for a given url
   * @return {Observable<boolean>}         Server's response, as an Observable
   */
  deleteContent(contentUrl: string): Observable<boolean> {
    return this.http.delete<boolean>(environment.URL.cms.content + '/' + contentUrl).pipe(timeout(TIMEOUT));
  }


  /**
   * Requests to create the content for a given url
   * @return {Observable<CmsContent>}         Server's response, as an Observable
   */
  createContent(newContent: CmsContent): Observable<CmsContent> {
    return this.http.post<CmsContent>(environment.URL.cms.content, newContent).pipe(timeout(TIMEOUT));
  }
}
