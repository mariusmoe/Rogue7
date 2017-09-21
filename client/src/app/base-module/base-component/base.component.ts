import { Component, OnInit, OnDestroy } from '@angular/core';

import { AuthService } from '../../_services/auth.service';
import { CMSService } from '../../_services/cms.service';

import { CmsContent } from '../../_models/cms';



@Component({
  selector: 'app-base-component',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
})
export class BaseComponent implements OnInit, OnDestroy {

  defaultRoutes = [
    {'title': 'DNL Server', route: 'dnl' },
  ];

  constructor(
    public authService: AuthService,
    public cmsService: CMSService) {
  }

  ngOnInit() {

  }

  ngOnDestroy() {
  }
}
