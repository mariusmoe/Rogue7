import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { PageEvent } from '@angular/material';

import { CMSService, MobileService } from '@app/services';
import { CmsContent } from '@app/models';

import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'search-results-component',
	templateUrl: './search.results.component.html',
	styleUrls: ['./search.results.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchResultsComponent implements OnInit {
	public pageSize = 10;
	public pageSizes = [10, 25, 50, 100];

	public get searchResults() { return this._searchResults; }
	public get displayedResults() { return this._displayedResults; }

	private _ngUnsub = new Subject();
	private _searchResults: CmsContent[];
	private _displayedResults = new BehaviorSubject<CmsContent[]>(null);

	constructor(
		private router: Router,
		public route: ActivatedRoute,
		public cmsService: CMSService,
		public mobileService: MobileService) {
	}

	ngOnInit() {
		this.setResults();

		this.router.events.pipe(takeUntil(this._ngUnsub)).subscribe(e => {
			if (e instanceof NavigationEnd) { this.setResults(); }
		});
	}

	/**
	 * Set searchResults helper
	 */
	private setResults() {
		this._searchResults = this.route.snapshot.data['SearchResults'] || [];
		this._displayedResults.next(this._searchResults.slice(0, this.pageSize));
	}

	/**
	 * Paginator helper function
	 * @param  {any}    event paginator event
	 */
	paginator(event: PageEvent) {
		this.pageSize = event.pageSize;
		const start = event.pageIndex * event.pageSize;
		this._displayedResults.next(this._searchResults.slice(start, start + event.pageSize));
	}

	/**
	 * Helper function for angular's *ngFor
	 * @param  {number}                   index the index of the item to track
	 * @param  {CmsContent}               item the item tracked
	 * @return {string}                   the item's title; used for tracking
	 */
	trackBy(index: number, item: CmsContent): string {
		return item.title;
	}
}
