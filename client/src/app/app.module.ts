import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './_guards/auth.guard';

// Base
import { AppComponent } from './app.component';

// Modules


const appRoutes: Routes = [
  // { path: 'login', component: LoginComponent },
  { path: '', loadChildren: 'app/base-module/base.module#BaseModule' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
