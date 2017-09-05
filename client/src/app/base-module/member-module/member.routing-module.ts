import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../_guards/auth.guard';

import { MemberHomeComponent } from './member-home-component/member-home.component';


const routes: Routes = [
  {
    path: '' , component: MemberHomeComponent, canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
 imports: [
   RouterModule.forChild(routes)
 ],
 exports: [
   RouterModule
 ]
})
export class MemberRoutingModule {}
