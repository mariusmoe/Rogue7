import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminGuard, DeactivateGuard } from '@app/guards';
import { ComposeComponent } from './compose-component/compose.component';


const routes: Routes = [
  { path: 'compose' , component: ComposeComponent, canActivate: [AdminGuard], canDeactivate: [DeactivateGuard], pathMatch: 'full' },
  { path: 'compose/:route', component: ComposeComponent, canActivate: [AdminGuard], canDeactivate: [DeactivateGuard] },
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
