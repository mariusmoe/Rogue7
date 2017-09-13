import { Component, OnChanges, Output, EventEmitter } from '@angular/core';

import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User, UpdatePasswordUser } from '../../_models/user';

import { AuthService } from '../../_services/auth.service';

enum STATES {
  LOADING,
  SUCCESS,
  TRY_AGAIN,
  TIMED_OUT,
}

@Component({
  selector: 'app-user-component',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  @Output() navigated: EventEmitter<boolean> = new EventEmitter();
  changePasswordForm: FormGroup;
  STATES = STATES;
  state: STATES;


  constructor(
    private router: Router,
    private fb: FormBuilder,
    public authService: AuthService) {
    this.changePasswordForm = fb.group({
      'currentPassword' : ['', Validators.required],
      'password': ['', Validators.required],
      'confirm': ['', Validators.required]
    }, { validator: this.matchingPasswords.bind(this) });
  }

  /**
   * Submits the changePasswordForm
   */
  submitForm() {
    this.state = STATES.LOADING;
    const user: UpdatePasswordUser = this.changePasswordForm.value;
    const sub = this.authService.updatePassword(user).subscribe(
      result => {
        sub.unsubscribe();
        if (result) {
          this.state = STATES.SUCCESS;
          this.changePasswordForm.reset();
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


  /**
   * Compares the password and confirm fields and returns true if they match
   * @param  {FormGroup} group the form group upon which the check is done
   * @return {boolean}         if the fields match
   */
  private matchingPasswords(group: FormGroup) {
    // if they do not match, then we return that matchingPasswords is true (in that it is an error)
    if (group.controls['password'].value !== group.controls['confirm'].value) {
      return { matchingPasswords: true };
    }
    return null;
  }


  /**
   * Navigates to the compose page
   */
  navigateToCompose() {
    this.navigated.emit(true);
    this.router.navigate(['compose']);
  }
}
