import { NgModule } from '@angular/core';

// Router
import { BaseRoutingModule } from './base.routing-module';

// Modules
import { SharedModule } from '@app/modules/shared.module';
import { PortalModule } from '@angular/cdk/portal';

// Components
import { BaseComponent } from './base-component/base.component';
import { HeaderComponent } from './header-component/header.component';
import { LoadingbarComponent } from './loadingbar-component/loadingbar.component';
import { ControlPanelComponent } from './control-panel-component/control.panel.component';
import { FooterComponent } from './footer-component/footer.component';
import { ContentComponent } from './content-component/content.component';
import { NavComponent } from './nav-component/nav.component';
import { SearchComponent } from './search-component/search.component';
import { SearchResultsComponent } from './search-results-component/search.results.component';
import { ModalComponent } from './modals/modal.component';

// Resolvers
import { CmsResolver, SearchResolver } from '@app/guards';

// Content Controllers
import { NgLinkComponent } from './content-controllers/nglink.component';

@NgModule({
	declarations: [
		BaseComponent,
		HeaderComponent,
		LoadingbarComponent,
		ControlPanelComponent,
		FooterComponent,
		ContentComponent,
		NavComponent,
		SearchComponent,
		SearchResultsComponent,
		ModalComponent,
		NgLinkComponent,
	],
	imports: [
		BaseRoutingModule,
		PortalModule,
		SharedModule.forRoot()
	],
	entryComponents: [
		ModalComponent,
		NgLinkComponent
	],
	providers: [
		CmsResolver, SearchResolver
	]
})
export class BaseModule { }
