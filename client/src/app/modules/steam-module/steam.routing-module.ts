import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@app/guards';

import { ServerComponent } from './server-component/server.component';

const routes: Routes = [
  { path: ':serverRoute' , component: ServerComponent },
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
