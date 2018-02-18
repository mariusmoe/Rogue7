import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { AdminService, MobileService, AuthService } from '@app/services';
import { User, ModalData } from '@app/models';

import { MatDialog, MatDialogConfig } from '@angular/material';

import { UserModalComponent, UserModalData } from '../user-modal-component/user.modal.component';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { takeUntil, distinctUntilChanged, debounceTime } from 'rxjs/operators';

@Component({
	selector: 'app-users-component',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit {
	private ngUnsubscribe = new Subject();

	public users: User[];
	public displayedResults = new BehaviorSubject<User[]>(null);
	public pageSize = 10;
	public pageSizes = [10, 25, 50, 100];
	private currentIndex = 0;

	filter = new BehaviorSubject<string>('');

	constructor(
		private dialog: MatDialog,
		public authService: AuthService,
		public adminService: AdminService,
		public mobileService: MobileService) {

		this.updateList();
	}

	ngOnInit() {
		this.filter.pipe(distinctUntilChanged(), debounceTime(300), takeUntil(this.ngUnsubscribe)).subscribe(value => {
			this.updateList();
		})
	}



	private updateList() {
		const sub = this.adminService.getAllusers().subscribe(users => {
			this.users = users;

			const list = this.users.filter((user: User) => user.username.toLowerCase().includes(this.filter.getValue().toLowerCase()));
			this.displayedResults.next(list.slice(this.currentIndex, this.pageSize));
			sub.unsubscribe();
		});
	}

	/**
	 * Paginator helper function
	 * @param  {any}    event paginator event
	 */
	paginator(event: any) {
		this.pageSize = event.pageSize;
		this.currentIndex = event.pageIndex * event.pageSize;
		this.displayedResults.next(this.users.slice(this.currentIndex, this.currentIndex + event.pageSize));
	}

	filterUsers(filter: string) {
		console.log(filter);
		this.filter.next(filter);
	}



	configUser(user: User) {
		this.dialog.open(
			UserModalComponent,
			<MatDialogConfig>{ data: <UserModalData>{ user: user } }
		).afterClosed().subscribe(closedResult => {
			this.updateList();
		});
	}


	/**
	 * Helper function for angular's *ngFor
	 * @param  {number}                   index the index of the item to track
	 * @param  {CmsContent}               item the item tracked
	 * @return {string}                   the item's ID; used for tracking
	 */
	trackBy(index: number, item: User): string {
		return item._id;
	}
}
