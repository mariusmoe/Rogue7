import { NgModule } from '@angular/core';

// Router
import { AdminRoutingModule } from './admin.routing-module';

// Modules
import { SharedModule, CommonModule } from '@app/modules';

// Components
import { SettingsComponent } from './settings-component/settings.component';
import { UsersComponent } from './users-component/users.component';
import { SteamComponent } from './steam-component/steam.component';
import { UserModalComponent } from './user-modal-component/user.modal.component';

@NgModule({
	declarations: [
		SettingsComponent,
		UsersComponent,
		SteamComponent,
		UserModalComponent
	],
	imports: [
		SharedModule,
		CommonModule,
		AdminRoutingModule
	],
	entryComponents: [
		UserModalComponent
	]
})
export class AdminModule { }
