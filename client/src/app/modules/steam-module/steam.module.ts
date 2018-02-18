import { NgModule } from '@angular/core';

// Router
import { SteamRoutingModule } from './steam.routing-module';

// Modules
import { SharedModule } from '@app/modules/shared.module';

// Components
import { ServerComponent } from './server-component/server.component';

// SteamResolver
import { SteamResolver } from '@app/guards';


@NgModule({
	declarations: [
		ServerComponent
	],
	imports: [
		SteamRoutingModule,
		SharedModule
	],
	providers: [
		SteamResolver
	]
})
export class SteamModule { }
