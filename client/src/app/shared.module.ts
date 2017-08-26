import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';




// services
import { AuthenticationService } from './_services/authentication.service';

// Modules
// import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

// import { TRANSLATION_PROVIDERS } from './translate/translate';
import { KeysPipe } from './_pipes/keys.pipe';
// import { DatePipe } from '@angular/common';




@NgModule({
  imports: [
  ],
  declarations: [
    // TranslatePipe,
    KeysPipe,
  ],
  providers: [
    AuthenticationService,
    // TRANSLATION_PROVIDERS,
    // TranslateService,
  ],
  exports: [
    CommonModule,
    KeysPipe,
    MaterialModule,
    RouterModule,
    HttpModule,
    // HttpModule,
    // TranslatePipe,
  ]
})
export class SharedModule { }
