import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { NgxSpinnerService } from 'ngx-spinner';

import { SnackbarProvider } from '../../../providers/snackbar.provider';
import { ValidateProvider } from '../../../providers/validate.provider';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public hidePassword: boolean;

  private _loginForm: FormGroup;
  private _authValueErrorMsg: string;
  private _passwordErrorMsg: string;

  get loginForm(): FormGroup {
    return this._loginForm;
  }

  get authValueErrorMsg() {
    return this._authValueErrorMsg;
  }

  get passwordErrorMsg() {
    return this._passwordErrorMsg;
  }

  get rememberUser() {
    return localStorage.getItem('rememberUser') == 'true';
  }

  get authValue() {
    return localStorage.getItem('rememberUser') == 'true' ? localStorage.getItem('authValue') : '';
  }

  constructor(
    private _authService: AuthService,
    private _spinnerService: NgxSpinnerService,
    private _validateProvider: ValidateProvider,
    private _snackbarProvider: SnackbarProvider,
    private _formBuilder: FormBuilder,
    private _router: Router
  ) {
    this.hidePassword = true;

    this._loginForm = this._formBuilder.group({
      authValue: [this.authValue, [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberUser: this.rememberUser,
    });
    if (!this._loginForm.value['rememberUser'])
      localStorage.removeItem('authValue');

    this._authValueErrorMsg = '';
    this._passwordErrorMsg = '';
  }

  login() {
    const authValue = this._loginForm.value['authValue'] || '';
    const password = this._loginForm.value['password'] || '';
    const rememberUser = this._loginForm.value['rememberUser'] || false;

    this._spinnerService.show();

    this._authService.login(authValue, password, rememberUser).subscribe((resp) => {
      this._spinnerService.hide();

      if (resp.error) {
        this._snackbarProvider.openNotifications(resp.msg, 'Error');
        return;
      }

      this._snackbarProvider.openNotifications(resp.msg, 'Success');
      this._router.navigateByUrl('/');
    });
  }

  validate(keyPressedEvent: any) {
    this.validateAuthValue(keyPressedEvent);
    this.validatePassword();
  }

  validateAuthValue(keyPressedEvent: any) {
    this._authValueErrorMsg = '';

    // Se valida si la tecla presionada es un @ para entonces comenzar a validar el campo usuario como un email
    if (keyPressedEvent.key == '@')
      this._loginForm = this._validateProvider.addEmailValidator(this._loginForm, 'authValue', true);

    // Se valida si el campo usuario ya no contiene un @, lo que indicaría que hay que dejar de validar el campo usuario como email
    if (!this._loginForm.value['authValue']!.includes('@'))
      this._loginForm = this._validateProvider.addEmailValidator(this._loginForm, 'authValue', false);

    const stateUser = this._loginForm.get('authValue')!.errors;
    if (stateUser)
      this._authValueErrorMsg = this._validateProvider.getErrorMsg(stateUser);
  }

  validatePassword() {
    this._passwordErrorMsg = '';

    const statePassword = this._loginForm.get('password')!.errors;
    if (statePassword)
      this._passwordErrorMsg = this._validateProvider.getErrorMsg(statePassword);
  }
}
