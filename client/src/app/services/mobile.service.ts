import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { environment } from '@env';

import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { takeUntil, share } from 'rxjs/operators';

@Injectable()
export class MobileService {
	private _ngUnsub = new Subject();
	private _isMobileSubject = new BehaviorSubject<boolean>(false);

	private mobileDevices = [
		Breakpoints.Handset,
		Breakpoints.Small,
		Breakpoints.TabletPortrait
	];

	constructor(
		private breakpointObserver: BreakpointObserver) {
		// Handle Mobile devices
		if (breakpointObserver.isMatched(this.mobileDevices)) { this._isMobileSubject.next(true); }

		// Handle Mobile breakpoint change
		this.breakpointObserver.observe(this.mobileDevices).pipe(takeUntil(this._ngUnsub), share()).subscribe(result => {
			this._isMobileSubject.next(result.matches);
		});
	}

	isMobile(): BehaviorSubject<boolean> {
		return this._isMobileSubject;
	}

}
