import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminGuard, DeactivateGuard } from '@app/guards';

import { SettingsComponent } from './settings-component/settings.component';


@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: SettingsComponent },
		])
	],
	exports: [
		RouterModule
	]
})
export class AdminRoutingModule { }
