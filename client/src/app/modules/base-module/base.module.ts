import { NgModule } from '@angular/core';

// Router
import { BaseRoutingModule } from './base.routing-module';

// Modules
import { SharedModule } from '@app/modules/shared.module';

// Components
import { BaseComponent } from './base-component/base.component';
import { LoginComponent } from './login-component/login.component';
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


@NgModule({
  declarations: [
    BaseComponent,
    LoginComponent,
    LoadingbarComponent,
    ControlPanelComponent,
    FooterComponent,
    ContentComponent,
    NavComponent,
    SearchComponent,
    SearchResultsComponent,
    ModalComponent
  ],
  imports: [
    BaseRoutingModule,
    SharedModule.forRoot()
  ],
  entryComponents: [
    ModalComponent
  ],
  providers: [
    CmsResolver, SearchResolver
  ]
})
export class BaseModule { }
