import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { environment } from '@env';

// Service Worker
import { WorkerService } from '@app/services';
import { ServiceWorkerModule } from '@angular/service-worker';


import { AppComponent } from './app.component';


const appRoutes: Routes = [
  { path: '', loadChildren: 'app/modules/base-module/base.module#BaseModule' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    environment.production ? WorkerService : [],
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
