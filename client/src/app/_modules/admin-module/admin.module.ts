import { NgModule } from '@angular/core';

// Router
import { AdminRoutingModule } from './admin.routing-module';

// Modules
import { SharedModule } from '../../_modules/shared.module';

// Components
import { ComposeComponent } from './compose-component/compose.component';
import { CKEditorComponent } from './ckeditor-component/ckeditor.component';


@NgModule({
  declarations: [
    ComposeComponent,
    CKEditorComponent
  ],
  imports: [
    SharedModule,
    AdminRoutingModule,
  ],
  entryComponents: [
  ],
  providers: [
    // GameService,
  ]
})
export class AdminModule { }
