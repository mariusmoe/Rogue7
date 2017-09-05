import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

// Base
import { AppComponent } from './app.component';

// Modules
import { AppRoutingModule } from './app.routing-module';
// import { CoreModule } from './core.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    // CoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
