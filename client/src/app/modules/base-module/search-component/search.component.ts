import { Component, ChangeDetectionStrategy } from '@angular/core';

import { CmsContent } from '@app/models';
import { CMSService } from '@app/services';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { takeUntil, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-search-component',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent {
  private ngUnsubscribe = new Subject();
  private searchTerms = new Subject<string>();

  constructor(private cmsService: CMSService) {
    this.searchTerms.pipe(
      takeUntil(this.ngUnsubscribe),
      debounceTime(300),        // 300ms
      // distinctUntilChanged(),   // ignore unchanged value
      switchMap((term: string) => {
        return (!term || term === '') ? of(null) : cmsService.searchContent(term);
      })
    ).subscribe(contentList => {
      if (!contentList) {
        cmsService.getContentList(true);
      } else {
        const sortedList = contentList.sort( (a, b) => {
          return a.textScore > b.textScore ? 1 : (a.textScore === b.textScore ? 0 : -1);
        });
        cmsService.setContentList(sortedList);
      }
    });
  }

  /**
   * [search description]
   * @param  {string} term [description]
   */
  search(term: string) {
    this.searchTerms.next(term);
  }

  /**
   * Clears the search result
   */
  clear() {
    this.searchTerms.next('');
  }

}
