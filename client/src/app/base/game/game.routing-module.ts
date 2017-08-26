import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../_guards/auth.guard';

import { OutletComponent } from './../outlet-component/outlet.component';
import { GameComponent } from './game-component/game.component';


const routes: Routes = [
  {
    path: '' , component: OutletComponent, // canActivate: [AuthGuard],
    children: [
      { path: '', component: GameComponent, pathMatch: 'full' },
      { path: '**', redirectTo: '', pathMatch: 'full' }
    ]
  },
];
const routes2: Routes = [
  {
    path: '' , component: GameComponent, // canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
 imports: [
   RouterModule.forChild(routes2)
 ],
 exports: [
   RouterModule
 ]
})
export class GameRoutingModule {}
