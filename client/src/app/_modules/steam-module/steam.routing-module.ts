import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../_guards/auth.guard';

import { DNLComponent } from './dnl-component/dnl.component';
import { ARKComponent } from './ark-component/ark.component';

const routes: Routes = [
  { path: 'dnl' , component: DNLComponent },
  { path: 'ark' , component: ARKComponent },
  { path: '**', redirectTo: 'dnl', pathMatch: 'full' }
];

@NgModule({
 imports: [
   RouterModule.forChild(routes)
 ],
 exports: [
   RouterModule
 ]
})
export class SteamRoutingModule {}
