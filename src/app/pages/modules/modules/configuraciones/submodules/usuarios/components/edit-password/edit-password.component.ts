import { Component, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/user.service';

import { SnackbarProvider } from '../../../../../../../../providers/snackbar.provider';
import { ValidateProvider } from '../../../../../../../../providers/validate.provider';

import { EntityIdServiceModalData } from '../../../../../../../../interfaces/EntityIdServiceModalData';

import { DefaultResponse } from '../../../../../../../../interfaces/DefaultResponse';

@Component({
  selector: 'edit-password-component',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.scss']
})
export class EditPasswordComponent {
  public hidePassword: boolean;
  public hideConfirmPassword: boolean;

  private _passwordForm: FormGroup;
  private _msgErrors: string[];

  get passwordForm() {
    return this._passwordForm;
  }

  get msgErrors() {
    return this._msgErrors;
  }

  constructor(
    private _formBuilder: FormBuilder,
    private _spinnerService: NgxSpinnerService,
    private _snackbarProvider: SnackbarProvider,
    private _validateProvider: ValidateProvider,
    private _dialogRef: MatDialogRef<EditPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EntityIdServiceModalData<UserService>
  ) {
    this.hidePassword = this.hideConfirmPassword = true;

    this._passwordForm = this._formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });

    this._msgErrors = [];
  }

  close() {
    this._dialogRef.close();
  }

  save() {
    this.validate();
    if (!this.validatePasswordsAreEquals()) {
      this._snackbarProvider.openNotifications('No coinciden las contraseñas', 'Error');
      return;
    }

    this._spinnerService.show('spinnerUpdatePasswordUser');
    this.data.service.updatePassword(this.data.entityId, this._passwordForm.get('password')!.value).subscribe((resp: DefaultResponse<null>) => {
      this._spinnerService.hide('spinnerUpdatePasswordUser');
      if (resp.error) {
        this._snackbarProvider.openNotifications(resp.msg, 'Error');
        return;
      }

      this._snackbarProvider.openNotifications(resp.msg, 'Success');
      this.close();
    });
  }

  validate() {
    for (const field in this._passwordForm.controls)
      this.validateField(field);
  }

  validatePasswordsAreEquals() {
    return this._passwordForm.get('password')!.value == this._passwordForm.get('confirmPassword')!.value;
  }

  validateField(attribute: string) {
    const errors = this._passwordForm.get(attribute)!.errors;
    switch (attribute) {
      case 'password':
        errors ? this._msgErrors[0] = this._validateProvider.getErrorMsg(errors) : this._msgErrors[0] = '';
        break;

      case 'confirmPassword':
        errors ? this._msgErrors[1] = this._validateProvider.getErrorMsg(errors) : this._msgErrors[1] = '';
        break;
    }
  }
}
