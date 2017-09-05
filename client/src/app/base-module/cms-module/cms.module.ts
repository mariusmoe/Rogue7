import { NgModule } from '@angular/core';

// Router
import { CMSRoutingModule } from './cms.routing-module';

// Modules
import { SharedModule } from '../../_modules/shared.module';
import { DateFnsModule } from 'ngx-date-fns';

// Components
import { CMSNewComponent } from './cms-new-component/cms-new.component';

// Services


@NgModule({
  declarations: [
    CMSNewComponent,
  ],
  imports: [
    CMSRoutingModule,
    SharedModule,
    DateFnsModule,
  ],
  entryComponents: [

  ],
  providers: [
  ]
})
export class MemberModule { }
