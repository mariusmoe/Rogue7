import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class MobileService {
	private _isMobileSubject = new BehaviorSubject<boolean>(false);

	private readonly _mobileDevices = [
		Breakpoints.Handset,
		Breakpoints.Small,
		Breakpoints.TabletPortrait
	];

	constructor(
		private breakpointObserver: BreakpointObserver) {
		// Handle Mobile devices
		if (breakpointObserver.isMatched(this._mobileDevices)) { this._isMobileSubject.next(true); }

		// Handle Mobile breakpoint change
		this.breakpointObserver.observe(this._mobileDevices).subscribe(result => {
			this._isMobileSubject.next(result.matches);
		});
	}

	isMobile(): BehaviorSubject<boolean> {
		return this._isMobileSubject;
	}

}
