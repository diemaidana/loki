// core/errors/http-message.ts
import { HttpErrorResponse } from '@angular/common/http';
import { ProblemDetail } from './problem-detail';

export function httpErrorMessage(err: HttpErrorResponse): string {
  if (err.status === 0) {
    return 'No se pudo conectar con el servidor.';
  }
  return (err.error as ProblemDetail | null)?.detail
      ?? 'Ocurrió un error inesperado. Intentá más tarde.';
}