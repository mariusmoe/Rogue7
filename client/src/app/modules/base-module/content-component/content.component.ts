import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';

import { CMSService, AuthService } from '@app/services';
import { ModalData, CmsContent, AccessRoles } from '@app/models';

import { ModalComponent } from '../modals/modal.component';

import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { takeUntil } from 'rxjs/operators';


@Component({
	selector: 'content-component',
	templateUrl: './content.component.html',
	styleUrls: ['./content.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentComponent implements OnInit, OnDestroy {
	public AccessRoles = AccessRoles;
	public contentSubject = new BehaviorSubject<CmsContent>(null);
	private ngUnsubscribe = new Subject();
	
	
	constructor(
		private dialog: MatDialog,
		private router: Router,
		private route: ActivatedRoute,
		public authService: AuthService,
		public cmsService: CMSService) {
	}

	ngOnInit() {
		this.contentSubject.next(this.prepareContent(this.route.snapshot.data['CmsContent']));

		this.router.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe(e => {
			if (e instanceof NavigationEnd) {
				this.contentSubject.next(this.prepareContent(this.route.snapshot.data['CmsContent']));
			}
		});
	}

	ngOnDestroy() {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}


	/**
	 * Prepare the content for display. This allows angular to catch our specific attributes later
	 * @param cmsContent
	 */
	private prepareContent(cmsContent: CmsContent): CmsContent {
		cmsContent.content = cmsContent.content.replace(/<a /g, '<a ngLink ');
		return cmsContent;
	}



	/**
	 * Navigate the user to the editor page.
	 */
	editPage() {
		this.router.navigateByUrl('/compose/' + this.contentSubject.getValue().route);
	}

	/**
	 * Opens a modal asking the user to verify intent to delete the page they're viewing
	 */
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
						this.router.navigateByUrl('/');
					}
				);
			},
			cancel: () => { },
		};
		this.dialog.open(ModalComponent, <MatDialogConfig>{ data: data });
	}
}
