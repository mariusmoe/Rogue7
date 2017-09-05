import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../_guards/auth.guard';

import { CMSNewComponent } from './cms-new-component/cms-new.component';


const routes: Routes = [
  {
    path: '' , component: CMSNewComponent, canActivate: [AuthGuard],
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
export class CMSRoutingModule {}
