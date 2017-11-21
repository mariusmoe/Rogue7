import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard, AdminGuard, CMSGuard, MobileGuard } from '@app/guards';

import { BaseComponent } from './base-component/base.component';
import { UserComponent } from './user-component/user.component';
import { ContentComponent } from './content-component/content.component';
import { NavComponent } from './nav-component/nav.component';
import { ControlPanelComponent } from './control-panel-component/control.panel.component';

const routes: Routes = [
  { path: '' , component: BaseComponent,
    children: [
      // admin routes
      { path: 'admin' , loadChildren: 'app/modules/admin-module/admin.module#AdminModule', canActivate: [AdminGuard] },
      // generic routes
      { path: 'steam', loadChildren: 'app/modules/steam-module/steam.module#SteamModule' },
      // User routes (all users)
      { path: 'user', component: UserComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      // mobile guarded routes
      { path: 'navigation', component: NavComponent, pathMatch: 'full', canActivate: [MobileGuard] },
      { path: 'controlpanel', component: ControlPanelComponent, pathMatch: 'full', canActivate: [MobileGuard] },
      // CMS routes
      { path: '' , redirectTo: 'home', pathMatch: 'full', canActivate: [CMSGuard] },
      { path: '**' , component: ContentComponent, canActivate: [CMSGuard]  },
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
