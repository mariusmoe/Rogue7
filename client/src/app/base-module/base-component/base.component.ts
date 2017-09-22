import { Component } from '@angular/core';

import { AuthService } from '../../_services/auth.service';
import { CMSService } from '../../_services/cms.service';


@Component({
  selector: 'app-base-component',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
})
export class BaseComponent {
  defaultRoutes = [
    {'title': 'ARK Server', route: 'steam/ark' },
    {'title': 'DNL Server', route: 'steam/dnl' },
  ];

  constructor(
    public authService: AuthService,
    public cmsService: CMSService) {
  }

  tempAdd() {
    const list = this.cmsService.getContentList().getValue();
    list.push(list[list.length - 1]);
    this.cmsService.getContentList().next(list);
  }
}
