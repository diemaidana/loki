import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth-service';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Preferir método explícito en AuthService (ej. isAuthenticated/isLoggedIn).
  // Si no existe, usar fallback simple (token en localStorage).
  const isAuthenticated = (() => {
    if (typeof (auth as any).isAuthenticated === 'function') {
      try { return (auth as any).isAuthenticated(); } catch { return false; }
    }
    if (typeof (auth as any).isLoggedIn === 'function') {
      try { return (auth as any).isLoggedIn(); } catch { return false; }
    }
    // fallback: comprobar token simple
    return !!localStorage.getItem('auth_token');
  })();

  if (isAuthenticated) return true;

  // redirige al sign-in y mantiene la URL de retorno
  return router.createUrlTree(['/sign-in'], { queryParams: { returnUrl: state.url } });
};
