import { NgModule } from '@angular/core';

// Router
import { ComposeRoutingModule } from './compose.routing-module';

// Modules
import { SharedModule, CommonModule } from '@app/modules';

// Components
import { ComposeComponent } from './compose-component/compose.component';
import { CKEditorComponent } from './ckeditor-component/ckeditor.component';

// Guards
import { DeactivateGuard } from '@app/guards';

@NgModule({
	declarations: [
		ComposeComponent,
		CKEditorComponent,
	],
	imports: [
		SharedModule,
		CommonModule,
		ComposeRoutingModule
	],
	providers: [
		DeactivateGuard
	]
})
export class ComposeModule { }
