import { NgModule } from '@angular/core';

// Router
import { MemberRoutingModule } from './member.routing-module';

// Modules
import { SharedModule } from '../../_modules/shared.module';
import { DateFnsModule } from 'ngx-date-fns';

// Components
import { MemberHomeComponent } from './member-home-component/member-home.component';

// Services
import { DNLService } from '../../_services/dnl.service';


@NgModule({
  declarations: [
    MemberHomeComponent,
  ],
  imports: [
    MemberRoutingModule,
    SharedModule,
    DateFnsModule,
  ],
  entryComponents: [

  ],
  providers: [
    DNLService,
  ]
})
export class MemberModule { }
