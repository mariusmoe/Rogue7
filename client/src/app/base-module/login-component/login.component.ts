import { Component, OnChanges, Output, EventEmitter } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../_models/user';

import { AuthService } from '../../_services/auth.service';


const EMAIL_REGEX = /\S+@\S+\.\S+/;

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
})
export class LoginComponent {
  @Output() navigated: EventEmitter<boolean> = new EventEmitter();
  loginForm: FormGroup;
  STATES = STATES;
  state: STATES;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public authService: AuthService) {
    this.loginForm = fb.group({
      'email': ['', Validators.pattern(EMAIL_REGEX)],
      'password': ['', Validators.required]
    });
  }

  submitForm() {
    this.state = STATES.LOADING;
    const user: User = this.loginForm.value;
    const sub = this.authService.login(user).subscribe(
      (loggedIn) => {
        sub.unsubscribe();
        if (loggedIn) {
          this.state = STATES.SUCCESS;
          this.navigated.emit(true);
          this.router.navigate(['/']);
          return;
        }
        this.state = STATES.TRY_AGAIN;
      },
      error => {
        sub.unsubscribe();
        this.state = STATES.TIMED_OUT;
      },
    );
  }
}
