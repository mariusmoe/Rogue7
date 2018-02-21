import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { SteamService } from '@app/services';
import { GameDig, SteamServer } from '@app/models';

import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { interval } from 'rxjs/observable/interval';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'server-component',
	templateUrl: './server.component.html',
	styleUrls: ['./server.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerComponent implements OnInit, OnDestroy {
	private ngUnsubscribe = new Subject();
	public serverSubject = new BehaviorSubject<SteamServer>(null);
	public serverRoute: string;

	constructor(
		public steamService: SteamService,
		private route: ActivatedRoute,
		private router: Router) {
	}


	ngOnInit() {
		this.serverSubject.next(this.route.snapshot.data['SteamServer']);
		this.router.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe(e => {
			if (e instanceof NavigationEnd) {
				this.serverSubject.next(this.route.snapshot.data['SteamServer']);
			}
		});

		this.serverRoute = this.route.snapshot.params['serverRoute'];

		// Query for Steam Server
		this.steamService.requestSteamServer(this.serverRoute).subscribe(
			c => { this.serverSubject.next(c); },
			err => { this.serverSubject.next(<SteamServer>{}); },
		);

		// Query for Steam Server DATA
		this.steamService.querySteamServerData(this.serverRoute);

		// every 30 sec, it asks again.
		interval(30 * 1000).pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
			this.steamService.querySteamServerData(this.serverRoute);
		});
	}

	ngOnDestroy() {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}


}
