import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';

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
	],
	providers: [
		DatePipe
	]
})
export class ComposeModule { }
