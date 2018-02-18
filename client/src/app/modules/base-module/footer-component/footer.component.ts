import { Component, ChangeDetectionStrategy } from '@angular/core';

import { environment } from '@env';


@Component({
	selector: 'app-footer-component',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {

	public desc = environment.FOOTER.desc;
	public copyright = environment.FOOTER.copyright;

	constructor() { }
}
