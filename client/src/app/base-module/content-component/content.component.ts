import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Router, ActivatedRoute } from '@angular/router';
import { CMSService } from '../../_services/cms.service';
import { AuthService } from '../../_services/auth.service';
import { CmsContent } from '../../_models/cms';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/publish';


@Component({
  selector: 'app-content-component',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent implements OnDestroy {
  private ngUnsubscribe = new Subject();
  public contentSubject = new BehaviorSubject<CmsContent>(null);
  url = '';
  editMode = false;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private san: DomSanitizer,
    public authService: AuthService,
    public cmsService: CMSService) {
    this.url = route.snapshot.url.join();
    route.url.takeUntil(this.ngUnsubscribe).subscribe( (url) => {
      this.url = url.join();
      cmsService.requestContent(this.url).subscribe(
        c => { this.contentSubject.next(c); },
        err => { this.contentSubject.next(<CmsContent>{}); },
      );
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  editPage() {
    this.router.navigateByUrl('/admin/compose/' + this.contentSubject.getValue().route);
  }
  deletePage() {
    const sub = this.cmsService.deleteContent(this.url).subscribe(
      () => {
        sub.unsubscribe();
        this.cmsService.getContentList(true);
        this.router.navigate(['/']);
      }
    );
  }
}
