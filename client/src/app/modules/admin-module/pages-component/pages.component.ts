import { Component, ChangeDetectionStrategy } from '@angular/core';

import { Router } from '@angular/router';

import { CmsContent, AccessRoles, TableSettings, ColumnType, ColumnDir } from '@app/models';
import { CMSService, MobileService } from '@app/services';

import { Subject } from 'rxjs/Subject';

@Component({
	selector: 'pages-component',
	templateUrl: './pages.component.html',
	styleUrls: ['./pages.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PagesComponent {

	public data = new Subject<CmsContent[]>();

	public readonly settings: TableSettings = {
		columns: [ // ['title', 'views', 'access', 'nav', 'edit'],
			{
				header: 'Title',
				property: 'title',
				sort: true,
			},
			{
				header: 'Views',
				property: 'views',
				sort: true,
				rightAlign: true,
			},
			{
				header: 'Access',
				property: 'access',
				sort: true,
				icon: (access: string): string => {
					switch (access) {
						case AccessRoles.admin: { return 'security'; }
						case AccessRoles.user: { return 'verified_user'; }
						case AccessRoles.everyone: { return 'group'; }
					}
				},
				displayFormat: (access: AccessRoles): string => {
					switch (access) {
						case AccessRoles.admin: { return 'Admins'; }
						case AccessRoles.user: { return 'Users'; }
						case AccessRoles.everyone: { return 'Everyone'; }
					}
				},
			},
			{
				header: 'Navigation',
				property: 'nav',
				sort: true,
				displayFormat: (nav: boolean): string => {
					return nav ? 'Shown' : 'Hidden';
				}
			},
			{
				header: 'Edit',
				property: 'route',
				sort: true,
				type: ColumnType.InternalLink,
				icon: () => 'mode_edit',
				noText: true,
				func: (route: string) => {
					return `/compose/${route}`;
				},
				narrow: true
			}
		],

		active: 'title',
		dir: ColumnDir.ASC,

		trackBy: (index: number, item: CmsContent) => item.route,

		mobile: ['title', 'views', 'route'], // route = edit
	};




	constructor(private cmsService: CMSService) {

		cmsService.getContentList(true).subscribe((contentList) => {
			this.data.next(contentList);
		});
	}
}
