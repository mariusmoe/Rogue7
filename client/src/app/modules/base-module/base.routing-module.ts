import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard, AdminGuard } from '@app/guards';
import { CmsContent } from '@app/models';

import { BaseComponent } from './base-component/base.component';
import { ContentComponent } from './content-component/content.component';

// CMS resoler
import { CmsResolver } from '@app/guards';


const routes: Routes = [
  { path: '' , component: BaseComponent,
    children: [
      // admin routes
      { path: 'admin' , loadChildren: 'app/modules/admin-module/admin.module#AdminModule', canActivate: [AdminGuard] },
      // generic routes
      { path: 'steam', loadChildren: 'app/modules/steam-module/steam.module#SteamModule' },
      // User routes (all users)
      { path: 'user', loadChildren: 'app/modules/user-module/user.module#UserModule', pathMatch: 'full', canActivate: [AuthGuard] },
      // CMS routes
      { path: '' , redirectTo: 'home', pathMatch: 'full' },
      { path: ':content' , component: ContentComponent, resolve: {
          CmsContent: CmsResolver
      }},
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
