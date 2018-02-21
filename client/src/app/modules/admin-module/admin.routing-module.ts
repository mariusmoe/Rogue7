import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminGuard, DeactivateGuard } from '@app/guards';

import { AdminComponent } from './admin-component/admin.component';


@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: AdminComponent },
		])
	],
	exports: [
		RouterModule
	]
})
export class AdminRoutingModule { }
