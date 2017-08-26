import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../_guards/auth.guard';

import { OutletComponent } from './outlet-component/outlet.component';
import { BaseComponent } from './base-component/base.component';
import { HomeComponent } from './home-component/home.component';


const routes: Routes = [
  {
    path: '' , component: BaseComponent, // canActivate: [AuthGuard],
    children: [
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'game', loadChildren: 'app/base/game/game.module#GameModule' },

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
