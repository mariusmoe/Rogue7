import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { MobileService } from '@app/services';


@Component({
	selector: 'settings-component',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {
	public settingsForm: FormGroup;

	constructor(
		public mobileService: MobileService,
		private fb: FormBuilder) {

		this.settingsForm = fb.group({
			'showAuthorDetails': [true, Validators.required],
		});
	}


	public submitForm() {

	}
}
