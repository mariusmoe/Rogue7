import { NgModule } from '@angular/core';

// Modules
import { SharedModule } from '@app/modules/shared-module/shared.module';

// Components
import { ContentComponent } from './content-component/content.component';
import { DynamicLinkComponent } from './content-controllers/dynamic.link.component';


@NgModule({
	declarations: [
		ContentComponent,
		DynamicLinkComponent,
	],
	imports: [
		SharedModule
	],
	entryComponents: [
		DynamicLinkComponent
	],
	exports: [
		ContentComponent
	]
})
export class ContentModule { }
