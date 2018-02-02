import { NgModule } from '@angular/core';

// Router
import { AdminRoutingModule } from './admin.routing-module';

// Modules
import { SharedModule } from '@app/modules/shared.module';
import { AuthedModule } from '@app/modules/authed.module';

// Components
import { ComposeComponent } from './compose-component/compose.component';
import { CKEditorComponent } from './ckeditor-component/ckeditor.component';
import { SteamComponent } from './steam-component/steam.component';

// Directive
import { CKeditorDirective } from './ckeditor-component/ckeditor.directive';

// Guards
import { DeactivateGuard } from '@app/guards';

@NgModule({
  declarations: [
    ComposeComponent,
    CKEditorComponent,
    SteamComponent,
    CKeditorDirective
  ],
  entryComponents: [
    CKEditorComponent
  ],
  imports: [
    AuthedModule,
    SharedModule,
    AdminRoutingModule
  ],
  providers: [
    DeactivateGuard
  ]
})
export class AdminModule { }
