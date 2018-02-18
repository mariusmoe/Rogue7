import { Component, OnDestroy, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { SteamService } from '@app/services';

import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'app-steam-component',
	templateUrl: './steam.component.html',
	styleUrls: ['./steam.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SteamComponent implements OnDestroy {
	private ngUnsubscribe = new Subject();
	forms: FormGroup[];


	// TODO: FIX ME!
	static disallowedRoutes(contentList: BehaviorSubject<any[]>) {
		return (control: AbstractControl): { [key: string]: any } => {
			const list = contentList.getValue();
			if (list && list.some((content) => content.route === control.value)) {
				return { routeAlreadyTaken: true };
			}
		};
	}


	constructor(
		private fb: FormBuilder,
		public steam: SteamService) {


		// https://angular.io/guide/reactive-forms#conclusion
	}

	ngOnDestroy() {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	addServer() {

	}

	editServer() {

	}

}
