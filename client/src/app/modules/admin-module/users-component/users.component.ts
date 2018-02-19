import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { AdminService, MobileService, AuthService } from '@app/services';
import { User, ModalData } from '@app/models';

import { MatDialog, MatDialogConfig, PageEvent } from '@angular/material';

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
	public pageIndex = 0;
	public numFilteredUsers = 0;

	private filterSubject = new BehaviorSubject<string>('');

	constructor(
		private dialog: MatDialog,
		public authService: AuthService,
		public adminService: AdminService,
		public mobileService: MobileService) {

		this.updateList();
	}

	ngOnInit() {
		this.filterSubject.pipe(distinctUntilChanged(), debounceTime(300), takeUntil(this.ngUnsubscribe)).subscribe(value => {
			this.updateFilteredList();
		})
	}



	private updateList() {
		const sub = this.adminService.getAllusers().subscribe(users => {
			this.users = users;
			this.updateFilteredList();
			
			sub.unsubscribe();
		});
	}

	private updateFilteredList(index: number = 0, start: number = 0) {
		this.pageIndex = index;
		const filteredList = this.users.filter((user: User) => user.username.toLowerCase().includes(this.filterSubject.getValue().toLowerCase()));
		this.numFilteredUsers = filteredList.length;
		this.displayedResults.next(filteredList.slice(start, start + this.pageSize));
		console.log(this.displayedResults.getValue());
	}


	/**
	 * Paginator helper function
	 * @param  {any}    event paginator event
	 */
	public paginator(event: PageEvent) {
		this.pageSize = event.pageSize;
		console.log(event.pageIndex);
		this.updateFilteredList(event.pageIndex, event.pageIndex * event.pageSize);
	}

	public filterUsers(filter: string) {
		this.filterSubject.next(filter);
	}



	public configUser(user: User) {
		this.dialog.open(
			UserModalComponent,
			<MatDialogConfig>{ data: <UserModalData>{ user: user, userList: this.users } }
		).afterClosed().subscribe((closedResult: boolean) => {
			if (closedResult) { this.updateList(); }
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
