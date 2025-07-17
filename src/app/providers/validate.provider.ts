import { Injectable } from '@angular/core';

import { FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidateProvider {
  constructor() { }

  getErrorMsg(state: Object): string {
    let msgError: string = '';
    const errors = Object.entries(state);
    errors.map((error) => {
      switch (error[0]) {
        case 'minlength':
          msgError = `Debe ingresar al menos ${error[1].requiredLength} caracteres`;
          break;
        case 'required':
          msgError = 'Campo requerido';
          break;
        case 'email':
          msgError = 'Correo no válido';
          break;
        case 'maxSize':
          msgError = `Tamaño máximo ${(<any>state).maxSize}MB`;
          break;
        case 'matDatepickerParse':
          msgError = 'Formato de fecha no válido';
          break;
        case 'matStartDateInvalid':
          msgError = 'Fecha de inicio no válida';
          break;
        case 'matEndDateInvalid':
          msgError = 'Fecha de fin no válida';
          break;
        case 'min':
          msgError = `No dígitos menores a ${(<any>state).min.min}`;
          break;
        case 'pattern':
          msgError = 'Formato no válido'
          break;
        default:
          msgError = '';
          break;
      }
    });

    return msgError;
  }

  addEmailValidator(formGroup: FormGroup, field: string, addValidator: boolean) {
    if (addValidator) {
      formGroup.get(field)!.addValidators(Validators.email);
      formGroup.get(field)!.updateValueAndValidity();
    } else {
      formGroup.get(field)!.removeValidators(Validators.email);
      formGroup.get(field)!.updateValueAndValidity();
    }

    return formGroup;
  }
}
