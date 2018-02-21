import { NgModule } from '@angular/core';

// Router
import { AdminRoutingModule } from './admin.routing-module';

// Modules
import { SharedModule, CommonModule } from '@app/modules';

// Components
import { AdminComponent } from './admin-component/admin.component';
import { SettingsComponent } from './settings-component/settings.component';
import { UsersComponent } from './users-component/users.component';
import { SteamComponent } from './steam-component/steam.component';
import { UserModalComponent } from './user-modal-component/user.modal.component';

@NgModule({
	declarations: [
		AdminComponent,
		UsersComponent,
		SettingsComponent,
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
