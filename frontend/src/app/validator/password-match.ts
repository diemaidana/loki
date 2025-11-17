import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * @param controlName Nombre del campo de la contraseña original.
 * @param matchingControlName Nombre del campo de confirmación.
 * @returns Función Validadora (ValidatorFn).
 */
export const passwordsMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  
  // Obtenemos las referencias a los controles de las contraseñas
  const password = control.get('password');
  const repassword = control.get('repassword');

  // Si los controles no existen (o el FormGroup no tiene estos nombres), no hacemos nada
  if (!password || !repassword) {
    return null;
  }

  // Si el campo de confirmación ya tiene errores, limpiamos los errores previos 
  // para evitar conflictos, excepto si es requerido.
  if (repassword.errors && !repassword.errors['passwordsDoNotMatch']) {
    return null;
  }

  // 🛑 LÓGICA PRINCIPAL: Comparación
  if (password.value !== repassword.value) {
    // Establece el error 'passwordsDoNotMatch' en el campo de confirmación
    repassword.setErrors({ passwordsDoNotMatch: true });
    return { passwordsDoNotMatch: true };
  } else {
    // Si coinciden, quitamos el error 'passwordsDoNotMatch' del campo de confirmación
    repassword.setErrors(null);
    return null;
  }
};