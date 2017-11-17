import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@app/guards';
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
