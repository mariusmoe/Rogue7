import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../_guards/auth.guard';
import { ComposeComponent } from './compose-component/compose.component';


const routes: Routes = [
  { path: 'compose' , component: ComposeComponent, canActivate: [AuthGuard], pathMatch: 'full' },
  { path: 'compose/:route', component: ComposeComponent, canActivate: [AuthGuard] },
];


@NgModule({
 imports: [
   RouterModule.forChild(routes)
 ],
 exports: [
   RouterModule
 ]
})
export class AdminRoutingModule {}
