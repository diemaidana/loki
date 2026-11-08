import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const documentLengthValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const type = control.get('documentType')?.value;
  const number = control.get('documentNumber')?.value;

  if (!type || !number) {
    return null;
  }

  const expected = type === 'DNI' ? 8 : 11;
  return number.length === expected ? null : { documentLength: { expected } };
};