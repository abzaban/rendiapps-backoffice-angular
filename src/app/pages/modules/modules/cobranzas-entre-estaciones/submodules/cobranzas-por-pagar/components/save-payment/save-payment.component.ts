import { Component, Inject, ViewChild, Output, EventEmitter } from '@angular/core';

import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { FilterInputComponent } from '../../../../../../../../shared/filter-input/filter-input.component';

import { NgxSpinnerService } from 'ngx-spinner';
import { CollectService } from '../../../../../../../../services/collect.service';

import { SnackbarProvider } from '../../../../../../../../providers/snackbar.provider';
import { ValidateProvider } from '../../../../../../../../providers/validate.provider';
import { FormatProvider } from '../../../../../../../../providers/format.provider';

import { ServiceModalData } from '../../../../../../../../interfaces/ServiceModalData';
import { PaymentSave } from '../../../../interfaces/PaymentSave';

import { DefaultResponse } from '../../../../../../../../interfaces/DefaultResponse';
import { EntityIdServiceModalData } from '../../../../../../../../interfaces/EntityIdServiceModalData';

@Component({
  selector: 'save-payment-component',
  templateUrl: './save-payment.component.html'
})
export class SavePaymentComponent {
  public maxDate: Date;

  private _paymentForm: FormGroup;
  private _msgErrors: string[];

  @ViewChild('townsFilterInput') townsFilterInput!: FilterInputComponent;
  @Output() enterprise!: EventEmitter<any>;

  get paymentForm() {
    return this._paymentForm;
  }

  get msgErrors() {
    return this._msgErrors;
  }

  constructor(
    private _formBuilder: FormBuilder,
    private _spinnerService: NgxSpinnerService,
    private _snackbarProvider: SnackbarProvider,
    private _validateProvider: ValidateProvider,
    private _formatProvider: FormatProvider,
    private _dialogRef: MatDialogRef<SavePaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EntityIdServiceModalData<CollectService>
  ) {
    this.maxDate = new Date();

    this._paymentForm = this._formBuilder.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      file: ['', [Validators.required]],
      paymentDate: ['', [Validators.required]],
    });

    this._msgErrors = [];
  }

  validate() {
    this.townsFilterInput.validate();
    for (const field in this._paymentForm.controls)
      this.validateField(field);
  }

  validateField(attribute: string) {
    const errors = this._paymentForm.get(attribute)!.errors;
    switch (attribute) {
      case 'amount':
        errors ? this._msgErrors[0] = this._validateProvider.getErrorMsg(errors) : this._msgErrors[0] = '';
        break;

      case 'file':
        errors ? this._msgErrors[1] = this._validateProvider.getErrorMsg(errors) : this._msgErrors[1] = '';
        break;

      case 'paymentDate':
        errors ? this._msgErrors[2] = this._validateProvider.getErrorMsg(errors) : this._msgErrors[2] = '';
        break;
    }
  }

  close() {
    this._dialogRef.close();
  }

  async save() {
    this._spinnerService.show('spinnerToggleSavePayment');

    const payment: PaymentSave = {
      amount: this._paymentForm.get('amount')!.value,
      file: await this._formatProvider.convertFileToBase64(this._paymentForm.get('file')!.value),
      paymentDate: this._formatProvider.dateObjToMDYString(<Date>this._paymentForm.get('paymentDate')!.value)
    };

    this.data.service.savePayment(this.data.entityId, payment).subscribe((resp: DefaultResponse<null>) => {
      this._spinnerService.hide('spinnerToggleSavePayment');
      if (resp.error) {
        this._snackbarProvider.openNotifications(resp.msg, 'Error');
        return;
      }

      this._snackbarProvider.openNotifications(resp.msg, 'Success');
      this.close();
    });
  }
}
