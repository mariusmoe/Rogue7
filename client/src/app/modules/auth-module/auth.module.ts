import { NgModule } from '@angular/core';

// Router
import { AuthRoutingModule } from './auth.routing-module';

// Modules
import { SharedModule, CommonModule } from '@app/modules';

// Components
import { LoginComponent } from './login-component/login.component';
import { AuthComponent } from './auth-component/auth.component';


@NgModule({
	declarations: [
		LoginComponent,
		AuthComponent
	],
	imports: [
		AuthRoutingModule,
		SharedModule,
		CommonModule
	]
})
export class AuthModule { }
