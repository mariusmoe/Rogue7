import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdminGuard, DeactivateGuard } from '@app/guards';
import { ComposeComponent } from './compose-component/compose.component';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: ComposeComponent, canActivate: [AdminGuard], canDeactivate: [DeactivateGuard], pathMatch: 'full' },
			{ path: ':route', component: ComposeComponent, canActivate: [AdminGuard], canDeactivate: [DeactivateGuard] },
		])
	],
	exports: [
		RouterModule
	]
})
export class ComposeRoutingModule { }
