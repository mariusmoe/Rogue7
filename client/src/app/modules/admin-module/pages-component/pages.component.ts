import { Component, ChangeDetectionStrategy } from '@angular/core';

import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

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
			},
			{
				header: 'Views',
				property: 'views',
				rightAlign: true,
			},
			{
				header: 'Access',
				property: 'access',
				icon: (c: CmsContent): string => {
					switch (c.access) {
						case AccessRoles.admin: { return 'security'; }
						case AccessRoles.user: { return 'verified_user'; }
						case AccessRoles.everyone: { return 'group'; }
					}
				},
				displayFormat: (c: CmsContent): string => {
					switch (c.access) {
						case AccessRoles.admin: { return 'Admins'; }
						case AccessRoles.user: { return 'Users'; }
						case AccessRoles.everyone: { return 'Everyone'; }
					}
				},
			},
			{
				header: 'Navigation',
				property: 'nav',
				displayFormat: (c: CmsContent): string => {
					return c.nav ? 'Shown' : 'Hidden';
				}
			},
			{
				header: 'Folder',
				property: 'folder',
			},
			{
				header: 'Last updated',
				property: 'updatedAt',
				displayFormat: (c: CmsContent): string => {
					return this.datePipe.transform(c.updatedAt);
				}
			},
			{
				header: 'Edit',
				property: 'route',
				noSort: true,
				type: ColumnType.InternalLink,
				icon: () => 'mode_edit',
				noText: true,
				func: (c: CmsContent) => {
					return `/compose/${c.route}`;
				},
				narrow: true
			}
		],

		active: 'title',
		dir: ColumnDir.ASC,

		trackBy: (index: number, item: CmsContent) => item.route,

		mobile: ['title', 'views', 'route'], // route = edit
	};




	constructor(private cmsService: CMSService, private datePipe: DatePipe) {

		cmsService.getContentList(true).subscribe((contentList) => {
			this.data.next(contentList);
		});
	}
}
