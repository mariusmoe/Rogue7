import { Component, ChangeDetectionStrategy } from '@angular/core';

import { MobileService } from '@app/services';

@Component({
	selector: 'sectionwrapper-component',
	templateUrl: './sectionwrapper.component.html',
	styleUrls: ['./sectionwrapper.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionWrapperComponent {

	constructor(public mobileService: MobileService) { }
}
