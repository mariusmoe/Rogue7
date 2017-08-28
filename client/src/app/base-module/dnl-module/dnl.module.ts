import { NgModule } from '@angular/core';

// Router
import { DNLRoutingModule } from './dnl.routing-module';

// Modules
import { SharedModule } from './../../shared.module';
import { DateFnsModule } from 'ngx-date-fns';

// Components
import { DNLServerComponent } from './dnlserver-component/dnlserver.component';

// Services
import { DNLService } from '../../_services/dnl.service';


@NgModule({
  declarations: [
    DNLServerComponent,
  ],
  imports: [
    DNLRoutingModule,
    SharedModule,
    DateFnsModule,
  ],
  entryComponents: [

  ],
  providers: [
    DNLService,
  ]
})
export class DNLModule { }
