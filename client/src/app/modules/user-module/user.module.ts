import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Modules
import { SharedModule } from '@app/modules/shared.module';
import { AuthedModule } from '@app/modules/authed.module';

// Guard
import { AuthGuard } from '@app/guards';

// Components
import { UserComponent } from './user-component/user.component';
import { ChangePasswordComponent } from './change-password-component/change.password.component';




const routes: Routes = [
  { path: '' , component: UserComponent, canActivate: [AuthGuard], pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];

@NgModule({
  declarations: [
    UserComponent,
    ChangePasswordComponent
  ],
  imports: [
    AuthedModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class UserModule { }
