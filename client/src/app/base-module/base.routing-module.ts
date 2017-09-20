import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../_guards/auth.guard';

import { BaseComponent } from './base-component/base.component';
import { LoginComponent } from './login-component/login.component';

import { ContentComponent } from './content-component/content.component';

const routes: Routes = [
  { path: '' , component: BaseComponent, // canActivate: [AuthGuard],
    children: [
      { path: 'admin' , loadChildren: 'app/base-module/admin-module/admin.module#AdminModule', canActivate: [AuthGuard] },
      { path: 'dnl', loadChildren: 'app/base-module/dnl-module/dnl.module#DNLModule' },
      { path: '' , redirectTo: 'home', pathMatch: 'full' },
      { path: '**' , component: ContentComponent },
    ]
  },
];


@NgModule({
 imports: [
   RouterModule.forChild(routes)
 ],
 exports: [
   RouterModule
 ]
})
export class BaseRoutingModule {}
