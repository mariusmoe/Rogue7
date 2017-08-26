import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './_guards/auth.guard';



const appRoutes: Routes = [
  // { path: 'login', component: LoginComponent },
  { path: '', loadChildren: 'app/base/base.module#BaseModule' },
  // { path: '', loadChildren: 'app/HomeModule/home.module#HomeModule', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
 imports: [
   RouterModule.forRoot(appRoutes)
 ],
 exports: [
   RouterModule
 ]
})
export class AppRoutingModule {}
