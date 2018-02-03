import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth-component/auth.component';

const routes: Routes = [
  { path: '' , component: AuthComponent, pathMatch: 'full' },
];


@NgModule({
 imports: [
   RouterModule.forChild(routes)
 ],
 exports: [
   RouterModule
 ]
})
export class AuthRoutingModule {}
