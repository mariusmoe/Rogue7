import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'app-user-component',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserComponent { }
