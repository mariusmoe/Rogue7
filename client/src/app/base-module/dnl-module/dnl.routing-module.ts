import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../_guards/auth.guard';

import { OutletComponent } from './../outlet-component/outlet.component';
import { DNLServerComponent } from './dnlserver-component/dnlserver.component';


const routes: Routes = [
  {
    path: '' , component: DNLServerComponent, // canActivate: [AuthGuard],
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
export class DNLRoutingModule {}
