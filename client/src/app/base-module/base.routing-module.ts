import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../_guards/auth.guard';

import { BaseComponent } from './base-component/base.component';
import { HomeComponent } from './home-component/home.component';
import { LoginComponent } from './login-component/login.component';


const routes: Routes = [
  {
    path: '' , component: BaseComponent, // canActivate: [AuthGuard],
    children: [
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'dnl', loadChildren: 'app/base-module/dnl-module/dnl.module#DNLModule' },
      { path: 'members', loadChildren: 'app/base-module/member-module/member.module#MemberModule' },

      { path: '**', redirectTo: '', pathMatch: 'full' },
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
