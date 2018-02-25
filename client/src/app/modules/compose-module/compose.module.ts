import { NgModule } from '@angular/core';

// Router
import { ComposeRoutingModule } from './compose.routing-module';

// Modules
import { SharedModule, CommonModule, ContentModule } from '@app/modules';

// Components
import { ComposeComponent } from './compose-component/compose.component';
import { CKEditorComponent } from './ckeditor-component/ckeditor.component';



@NgModule({
	declarations: [
		ComposeComponent,
		CKEditorComponent,
	],
	imports: [
		SharedModule,
		ContentModule,
		CommonModule,
		ComposeRoutingModule
	]
})
export class ComposeModule { }
