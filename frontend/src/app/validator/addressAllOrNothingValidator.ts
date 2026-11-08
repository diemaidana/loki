import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

// validator/address-all-or-nothing.ts
export const addressAllOrNothingValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = control.value as Record<string, string>;
  const algoCargado = Object.values(value).some((v) => !!v && v.trim() !== '');

  if (!algoCargado) {
    return null;   // vacía por completo: válida
  }

  const obligatorios = ['street', 'city', 'province', 'postalCode'];
  const faltan = obligatorios.filter((name) => !control.get(name)?.value);

  return faltan.length ? { addressIncomplete: { faltan } } : null;
};