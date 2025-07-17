import { Component, Inject } from '@angular/core';

import { Validators, FormControl } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { NgxSpinnerService } from 'ngx-spinner';
import { CollectService } from 'src/app/services/collect.service';

import { ValidateProvider } from '../../../../../../../../providers/validate.provider';
import { SnackbarProvider } from '../../../../../../../../providers/snackbar.provider';

import { EntityIdServiceModalData } from '../../../../../../../../interfaces/EntityIdServiceModalData';

import { DefaultResponse } from '../../../../../../../../interfaces/DefaultResponse';

@Component({
  selector: 'reject-collect-component',
  templateUrl: './reject-collect.component.html'
})
export class RejectCollectComponent {
  private _rejectedNoteForm: FormControl;
  private _rejectedNoteErrorMsg: string;

  get rejectedNoteForm() {
    return this._rejectedNoteForm;
  }

  get rejectedNoteErrorMsg() {
    return this._rejectedNoteErrorMsg;
  }

  constructor(
    private _spinnerService: NgxSpinnerService,
    private _snackbarProvider: SnackbarProvider,
    private _validateProvider: ValidateProvider,
    private _dialogRef: MatDialogRef<RejectCollectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EntityIdServiceModalData<CollectService>
  ) {
    this._rejectedNoteForm = new FormControl('', Validators.required);
    this._rejectedNoteErrorMsg = '';
  }

  validateRejectedNote() {
    this._rejectedNoteErrorMsg = '';

    const stateRejectedNote = this._rejectedNoteForm!.errors;
    if (stateRejectedNote)
      this._rejectedNoteErrorMsg = this._validateProvider.getErrorMsg(stateRejectedNote);
  }

  close() {
    this._dialogRef.close();
  }

  reject() {
    this.data.service.reject(this.data.entityId, this._rejectedNoteForm.value).subscribe((resp: DefaultResponse<null>) => {
      this._spinnerService.hide('spinnerRejectCollect');
      this._snackbarProvider.openNotifications(resp.msg, resp.error ? 'Error' : 'Success');
      if (resp.error)
        return;

      this.close();
    });
  }
}
