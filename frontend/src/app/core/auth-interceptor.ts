import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { API_BASE_URL } from "./api.config";
import { EXPIRES_AT_STORAGE_KEY, TOKEN_STORAGE_KEY } from "./storage-key";

const PUBLIC_AUTH_PATHS = ['/auth/login', '/auth/register', '/auth/password/', '/auth/email/', '/auth/me'];

function isApiRequest(url: string): boolean {
  return url.startsWith('/') && !url.startsWith('/assets');
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const apiBaseUrl = inject(API_BASE_URL);
    const router = inject(Router);

    if (!isApiRequest(req.url)) {
        return next(req);
    }

    let apiReq = req.clone({
        url: `${apiBaseUrl}${req.url}`
    });

    const token = localStorage.getItem("auth_token");
    if (token) {
        apiReq = apiReq.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }
    
    return next(apiReq).pipe(
    catchError((err: HttpErrorResponse) => {
      const isPublicAuth = PUBLIC_AUTH_PATHS.some((path) => req.url.startsWith(path));

      if (err.status === 401 && !isPublicAuth) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(EXPIRES_AT_STORAGE_KEY);
        router.navigate(['/sign-in'], { queryParams: { returnUrl: router.url } });
      }

      return throwError(() => err);
    }),
  );
};