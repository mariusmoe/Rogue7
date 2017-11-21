import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { Router } from '@angular/router';

import { MobileService } from '@app/services';

@Component({
  selector: 'app-base-component',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseComponent {
  constructor(
    public mobileService: MobileService,
    public router: Router,
    private iconRegistry: MatIconRegistry,
    private san: DomSanitizer) {
    // Register logo
    iconRegistry.addSvgIcon('logo', san.bypassSecurityTrustResourceUrl('assets/logo256.svg'));
  }
}
