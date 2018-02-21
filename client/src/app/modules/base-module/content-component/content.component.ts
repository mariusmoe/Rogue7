import { Component, OnInit, AfterViewInit, OnDestroy, DoCheck, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFactoryResolver, InjectionToken, Injector, ComponentFactory, ViewChild, ElementRef, ComponentRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';

import { CMSService, AuthService } from '@app/services';
import { ModalData, CmsContent, AccessRoles } from '@app/models';

import { ModalComponent } from '../modals/modal.component';

import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { takeUntil } from 'rxjs/operators';

import { NgLinkComponent } from '../content-controllers/nglink.component';


@Component({
	selector: 'content-component',
	templateUrl: './content.component.html',
	styleUrls: ['./content.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentComponent implements OnInit, AfterViewInit, OnDestroy, DoCheck {
	public AccessRoles = AccessRoles;
	public contentSubject = new BehaviorSubject<CmsContent>(null);
	private ngUnsubscribe = new Subject();

	@ViewChild('contentHost') contentHost: ElementRef;
	private _ngLinkFactory: ComponentFactory<NgLinkComponent>;
	private embeddedComponents: ComponentRef<any>[] = [];

	constructor(
		private resolver: ComponentFactoryResolver,
		private injector: Injector,
		private san: DomSanitizer,
		private dialog: MatDialog,
		private router: Router,
		private route: ActivatedRoute,
		public authService: AuthService,
		public cmsService: CMSService) {

		this._ngLinkFactory = resolver.resolveComponentFactory(NgLinkComponent);

	}

	ngOnInit() {
		this.contentSubject.next(this.route.snapshot.data['CmsContent']);
		this.router.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe(e => {
			if (e instanceof NavigationEnd) {
				this.contentSubject.next(this.route.snapshot.data['CmsContent']);
				this.build(this.contentSubject.getValue());
			}
		});
	}

	ngAfterViewInit() {
		this.build(this.contentSubject.getValue());
	}

	ngOnDestroy() {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();

		// destroy these components else there will be memory leaks
		this.embeddedComponents.forEach(comp => comp.destroy());
		this.embeddedComponents.length = 0;
	}

	ngDoCheck() {
		this.embeddedComponents.forEach(comp => comp.changeDetectorRef.detectChanges());
	}

	/**
	 * Inserts the content into DOM
	 * @param cmsContent
	 */
	private build(cmsContent: CmsContent) {
		const e = (<HTMLElement>this.contentHost.nativeElement);
		cmsContent.content = cmsContent.content
		e.innerHTML = cmsContent.content.replace(/<a /g, '<nglink ').replace(/<\/a>/g, '</nglink>');
		if (!cmsContent.content) { return; }

		// query for elements we need to adjust

		const ngLinks = e.querySelectorAll(this._ngLinkFactory.selector);

		for (let i = 0; i < ngLinks.length; i++) {
            const link = ngLinks.item(i);
			// save text content before we modify the element
            const savedTextContent = link.textContent;

			//convert NodeList into an array, since Angular dosen't like having a NodeList passed for projectableNodes
			const comp = this._ngLinkFactory.create(this.injector, [Array.prototype.slice.call(link.childNodes)], link);
			//apply inputs into the dynamic component
			//only static ones work here since this is the only time they're set
			for (const attr of (link as any).attributes) {
				comp.instance[attr.nodeName] = attr.nodeValue;
            }
            comp.instance.link = link.getAttribute('href');
            comp.instance.text = savedTextContent;

			this.embeddedComponents.push(comp);
		}
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
