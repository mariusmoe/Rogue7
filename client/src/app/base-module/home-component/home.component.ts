import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication.service';
import { User } from '../../_models/user';
import { MdSnackBar } from '@angular/material';

import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-login',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  // animations: [ slideDownFadeInAnimation ]
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    public snackBar: MdSnackBar,
    private authenticationService: AuthenticationService,
  ) {
   }

  ngOnInit() {
  }
  ngOnDestroy() {
  }
}
