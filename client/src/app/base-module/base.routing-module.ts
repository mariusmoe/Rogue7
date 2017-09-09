import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../_guards/auth.guard';

import { BaseComponent } from './base-component/base.component';
import { LoginComponent } from './login-component/login.component';

import { CreateComponent } from './cms/create-component/create.component';
import { ContentComponent } from './cms/content-component/content.component';

const routes: Routes = [
  { path: '' , component: BaseComponent, // canActivate: [AuthGuard],
    children: [
      { path: 'compose' , component: CreateComponent, canActivate: [AuthGuard], pathMatch: 'full' },
      { path: 'compose/:route', component: CreateComponent, canActivate: [AuthGuard], pathMatch: 'full' },
      { path: 'dnl', loadChildren: 'app/base-module/dnl-module/dnl.module#DNLModule' },
      { path: 'home' , component: ContentComponent },
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
