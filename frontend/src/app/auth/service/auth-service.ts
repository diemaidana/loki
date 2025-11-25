import { inject, Injectable } from '@angular/core';
import { UserService } from '../../service/user-service';
import { BehaviorSubject, catchError, firstValueFrom, map, Observable, tap, throwError } from 'rxjs';
import { User } from '../../model/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly userService = inject(UserService);

  // Fuente de verdad del estado del usuario
  private userSubject = new BehaviorSubject<User | null>(null);
  public userState$ = this.userSubject.asObservable();

  constructor() {
    this.checkInitialAuth();
  }

  private checkInitialAuth(): void {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    if (token && userData) {
      this.userSubject.next(JSON.parse(userData));
    }
  }

  isLoggedIn(): boolean {
    return !!this.userSubject.value; 
  }

  /**
   * Valida el email y contraseña contra el json-server usando UserService.
   */
  login(email: string, password: string): Observable<User> {
    // Llamamos al UserService para obtener los usuarios y filtramos
    // Nota: Asumimos que userService.getUsers() retorna Observable<User[]>
    return this.userService.getUsers().pipe(
      map(users => {
        // Buscamos el usuario que coincida con email y password
        const user = users.find(u => u.email === email && (u as any).password === password);
        
        if (!user) {
          throw new Error('Credenciales inválidas');
        }
        
        return user;
      }),
      tap((user) => {
        // Login exitoso: Actualizamos estado y localStorage
        this.userSubject.next(user);
        
        // Usamos el ID del usuario como token simple o generamos uno
        const token = `token_${(user as any).id || Date.now()}`;
        
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
      }),
      catchError(err => {
        // Propagamos el error para que el componente lo maneje
        return throwError(() => err);
      })
    );
  }

  updateCurrentUser(user: User): void {
    // 1. Emitimos el nuevo valor a todos los suscriptores (Header, etc.)
    this.userSubject.next(user);
    
    // 2. Actualizamos la persistencia para que no se pierda al recargar
    localStorage.setItem('user_data', JSON.stringify(user));
  }
  
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    this.userSubject.next(null);
  }
}
