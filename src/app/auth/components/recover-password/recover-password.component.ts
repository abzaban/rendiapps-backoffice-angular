import { Component } from '@angular/core';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../services/auth.service';

import { SnackbarProvider } from 'src/app/providers/snackbar.provider';
import { ValidateProvider } from '../../../providers/validate.provider';

import { DefaultResponse } from '../../../interfaces/DefaultResponse';
import { ErrorResponse } from '../../../interfaces/ErrorResponse';

@Component({
  selector: 'recover-password-component',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss'],
})
export class RecoverPasswordComponent {
  private _recoverPasswordForm: FormGroup;
  private _emailErrorMsg: string;

  get recoverPasswordForm() {
    return this._recoverPasswordForm;
  }

  get emailErrorMsg() {
    return this._emailErrorMsg;
  }

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _spinnerService: NgxSpinnerService,
    private _snackbarProvider: SnackbarProvider,
    private _validateProvider: ValidateProvider
  ) {
    this._recoverPasswordForm = this._formBuilder.group({
      email: ['', [
        Validators.email,
        Validators.required
      ]]
    });

    this._emailErrorMsg = '';
  }

  sendEmail() {
    this._spinnerService.show();

    this._authService.sendMailToRecoverPassword(this._recoverPasswordForm.value['email'] || '').subscribe((resp: DefaultResponse<null>) => {
      this._spinnerService.hide();

      if (resp.error) {
        let respError: ErrorResponse = <ErrorResponse>resp;
        this._snackbarProvider.openNotifications(respError.errors.email, 'Error');
        return;
      }

      this._snackbarProvider.openNotifications(resp.msg, 'Success');
    });
  }

  validate() {
    this._emailErrorMsg = '';
    const stateEmail = this._recoverPasswordForm.get('email')!.errors;
    if (stateEmail != null)
      this._emailErrorMsg = this._validateProvider.getErrorMsg(stateEmail);
  }
}
