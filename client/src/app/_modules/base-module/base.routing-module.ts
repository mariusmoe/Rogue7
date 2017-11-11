import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../_guards/auth.guard';

import { BaseComponent } from './base-component/base.component';
import { UserComponent } from './user-component/user.component';
import { ContentComponent } from './content-component/content.component';

const routes: Routes = [
  { path: '' , component: BaseComponent, // canActivate: [AuthGuard],
    children: [
      { path: 'admin' , loadChildren: 'app/_modules/admin-module/admin.module#AdminModule', canActivate: [AuthGuard] },
      { path: 'user', component: UserComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'steam', loadChildren: 'app/_modules/steam-module/steam.module#SteamModule' },
      { path: '' , redirectTo: 'home', pathMatch: 'full' },
      { path: '**' , component: ContentComponent },
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
