import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';

import { CMSService, AuthService } from '@app/services';
import { ModalData, CmsContent } from '@app/models';

import { ModalComponent } from '../modals/modal.component';

import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-content-component',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentComponent implements OnDestroy {
  private ngUnsubscribe = new Subject();
  public contentSubject = new BehaviorSubject<CmsContent>(null);


  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private san: DomSanitizer,
    public authService: AuthService,
    public cmsService: CMSService) {
    route.url.pipe(takeUntil(this.ngUnsubscribe)).subscribe( (url) => {
      cmsService.requestContent(url.join()).subscribe(
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
    const content = this.contentSubject.getValue();
    const data: ModalData = {
      headerText: 'Delete ' + content.title,
      bodyText: 'Do you wish to proceed?',

      proceedColor: 'warn',
      proceedText: 'Delete',

      cancelColor: 'accent',
      cancelText: 'Cancel',

      includeCancel: true,

      proceed: () => {
        const sub = this.cmsService.deleteContent(content.route).subscribe(
          () => {
            sub.unsubscribe();
            this.cmsService.getContentList(true);
            this.router.navigate(['/']);
          }
        );
      },
      cancel: () => {},
    };
    this.dialog.open(ModalComponent, <MatDialogConfig>{ data: data });
  }
}
