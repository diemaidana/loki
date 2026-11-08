import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EXPIRES_AT_STORAGE_KEY, TOKEN_STORAGE_KEY } from '../../core/storage-key';
import { LoginResponse } from '../dto/login-response';
import { Account } from '../../model/account';
import { RegisterRequest } from '../dto/register-request';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private accountSubject = new BehaviorSubject<Account | null>(null);
  public account$ = this.accountSubject.asObservable();


  isLoggedIn(): boolean {
    return !! this.accountSubject.value; 
  }
  
  login(email: string, password: string): Observable<void> {
    return this.http.post<LoginResponse>('/auth/login', { email, password }).pipe(
      tap((response) => {
        // Login exitoso: Actualizamos estado y localStorage
        localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
        localStorage.setItem(EXPIRES_AT_STORAGE_KEY, response.expiresAt);
        this.accountSubject.next(response.account);
      }),
      map(() => void 0),
    );
  }

  restoreSession(): Observable<void> {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    const expiresAt = localStorage.getItem(EXPIRES_AT_STORAGE_KEY);

    if (!token || !expiresAt || new Date() > new Date(expiresAt)) {
      this.clearSession();
      return of(void 0);
    }

    return this.http.get<Account>('/auth/me').pipe(
      tap((account) => this.accountSubject.next(account)),
      map(() => void 0),
      catchError(() => {
        this.clearSession();
        return of(void 0);
      }),
    );
  }
  register(data: RegisterRequest): Observable<Account | null> {
    return this.http.post<Account>('/auth/register', data, { observe: 'response' }).pipe(
      map((res) => (res.status === 201 ? res.body : null)),
    );
  }

  updateCurrentUser(account: Account): void {
    this.accountSubject.next(account);
  }

  logout(): void {
    this.clearSession();
  }
  
  private clearSession(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(EXPIRES_AT_STORAGE_KEY);
    localStorage.removeItem('user_data');
    this.accountSubject.next(null);
  }
}
