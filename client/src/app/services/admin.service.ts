import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '@env';
import { User, AccessRoles } from '@app/models';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { map, catchError, timeout, takeUntil } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';  // will be from 'rxjs' in v6


@Injectable()
export class AdminService {
	constructor(private http: HttpClient, private router: Router) {
	}


	// ---------------------------------------
	// ------------- HTTP METHODS ------------
	// ---------------------------------------

	getAllusers(): Observable<User[]> {
		return this.http.get<User[]>(environment.URL.admin.users.all).pipe(timeout(environment.TIMEOUT));
	}


	setUserRole(user: User, role: AccessRoles): Observable<boolean> {
		return this.http.post<boolean>(environment.URL.admin.users.role, {
			user: user,
			role: role
		}).pipe(timeout(environment.TIMEOUT));
	}
}
