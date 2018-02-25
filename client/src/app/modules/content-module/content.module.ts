import { NgModule } from '@angular/core';

// Modules
import { SharedModule } from '@app/modules/shared-module/shared.module';

// Components
import { ContentComponent } from './content-component/content.component';
import { NgLinkComponent } from './content-controllers/nglink.component';


@NgModule({
	declarations: [
		ContentComponent,
		NgLinkComponent,
	],
	imports: [
		SharedModule
	],
	entryComponents: [
		NgLinkComponent
	],
	exports: [
		ContentComponent
	]
})
export class ContentModule { }
