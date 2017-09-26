import { Component, OnChanges, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../_models/user';

import { AuthService } from '../../_services/auth.service';


import { BehaviorSubject } from 'rxjs/BehaviorSubject';

enum STATES {
  LOADING,
  SUCCESS,
  TRY_AGAIN,
  TIMED_OUT,
}

@Component({
  selector: 'app-login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  @Output() navigated: EventEmitter<boolean> = new EventEmitter();
  public loginForm: FormGroup;
  STATES = STATES;
  public state = new BehaviorSubject<STATES>(null);

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public authService: AuthService) {
    this.loginForm = fb.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required]
    });
  }


  /**
   * Submits the login form
   */
  logIn() {
    this.state.next(STATES.LOADING);
    const user: User = this.loginForm.getRawValue();
    const sub = this.authService.login(user).subscribe(
      (loggedIn) => {
        sub.unsubscribe();
        if (loggedIn) {
          this.state.next(STATES.SUCCESS);
          this.navigated.emit(true);
          this.router.navigate(['/']);
          return;
        }
        this.state.next(STATES.TRY_AGAIN);
      },
      (error: HttpErrorResponse) => {
        sub.unsubscribe();
        if (error && error.status >= 400 && error.status < 500) {
          this.state.next(STATES.TRY_AGAIN);
          return;
        }
        this.state.next(STATES.TIMED_OUT);
      },
    );
  }

  /**
   * Sends a request to the auth service to log out the user
   */
  logOut() {
    this.navigated.emit(true);
    this.authService.logOut();
  }
}
