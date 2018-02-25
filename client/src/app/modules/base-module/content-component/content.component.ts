import {
	Component, OnInit, AfterViewInit, OnDestroy, DoCheck, ChangeDetectionStrategy, ChangeDetectorRef,
	ComponentFactoryResolver, InjectionToken, Injector, ComponentFactory, ViewChild, ElementRef, ComponentRef
} from '@angular/core';
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
	private embeddedComponents: ComponentRef<NgLinkComponent>[] = [];

	constructor(
		private resolver: ComponentFactoryResolver,
		private injector: Injector,
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
				this.build(this.contentSubject.getValue()); // change detection via contentSubject above
			}
		});
	}

	ngAfterViewInit() {
		this.build(this.contentSubject.getValue());
		// Detect changes manually for each component.
		this.embeddedComponents.forEach(comp => comp.changeDetectorRef.detectChanges());
	}

	ngOnDestroy() {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
		// Clean components
		this.cleanEmbeddedComponents();
	}

	ngDoCheck() {
		this.embeddedComponents.forEach(comp => comp.changeDetectorRef.detectChanges());
	}

	/**
	 * Inserts the content into DOM
	 * @param cmsContent
	 */
	private build(cmsContent: CmsContent) {
		// Clean components before rebuilding. Should always do this.
		this.cleanEmbeddedComponents();

		// null ref checks
		if (!this.contentHost || !this.contentHost.nativeElement || !cmsContent || !cmsContent.content) {
			return;
		}
		const e = (<HTMLElement>this.contentHost.nativeElement);

		const nglinksel = this._ngLinkFactory.selector;
		e.innerHTML = cmsContent.content.replace(/<a /g, `<${nglinksel} `).replace(/<\/a>/g, `</${nglinksel}>`);

		// query for elements we need to adjust
		const ngLinks = e.querySelectorAll(this._ngLinkFactory.selector);
		for (let i = 0; i < ngLinks.length; i++) {
			const link = ngLinks.item(i);
			const savedTextContent = link.textContent; // save text content before we modify the element
			// convert NodeList into an array, since Angular dosen't like having a NodeList passed for projectableNodes
			const comp = this._ngLinkFactory.create(this.injector, [Array.prototype.slice.call(link.childNodes)], link);
			// apply inputs into the dynamic component
			// only static ones work here since this is the only time they're set
			for (const attr of (link as any).attributes) {
				comp.instance[attr.nodeName] = attr.nodeValue;
			}
			comp.instance.link = link.getAttribute('href');
			comp.instance.text = savedTextContent;

			this.embeddedComponents.push(comp);
		}
	}

	private cleanEmbeddedComponents() {
		// destroycomponents to avoid be memory leaks
		this.embeddedComponents.forEach(comp => comp.destroy());
		this.embeddedComponents.length = 0;
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
			headerText: `Delete ${content.title}`,
			bodyText: 'Do you wish to proceed?',
			proceedText: 'Delete', proceedColor: 'warn',
			cancelText: 'Cancel', cancelColor: 'accent',
			cancel: () => { },
			proceed: () => {
				const sub = this.cmsService.deleteContent(content.route).subscribe(
					() => {
						sub.unsubscribe();
						this.cmsService.getContentList(true);
						this.router.navigateByUrl('/');
					}
				);
			},
		};
		this.dialog.open(ModalComponent, <MatDialogConfig>{ data: data });
	}
}
