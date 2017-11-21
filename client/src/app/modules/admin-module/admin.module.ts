import { NgModule } from '@angular/core';

// Router
import { AdminRoutingModule } from './admin.routing-module';

// Modules
import { SharedModule } from '@app/modules/shared.module';

// Components
import { ComposeComponent } from './compose-component/compose.component';
import { CKEditorComponent } from './ckeditor-component/ckeditor.component';
import { SteamComponent } from './steam-component/steam.component';

// Guards
import { DeactivateGuard } from '@app/guards';

@NgModule({
  declarations: [
    ComposeComponent,
    CKEditorComponent,
    SteamComponent
  ],
  imports: [
    SharedModule,
    AdminRoutingModule,
  ],
  providers: [
    DeactivateGuard
  ]
})
export class AdminModule { }
