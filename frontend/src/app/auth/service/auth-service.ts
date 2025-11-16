import { inject, Injectable } from '@angular/core';
import { UserService } from '../../service/user-service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly userService = inject(UserService);

  // devuelve Promise<boolean> indicando si las credenciales son válidas
  async login(email: string, password: string): Promise<boolean> {
    try {
      const users = await firstValueFrom(this.userService.getUsers());
      return users.some(u => u.email === email && u.password === password);
    } catch (err) {
      console.error('AuthService.login error', err);
      return false;
    }
  }

  // placeholder para logout / estado / token
  logout(): void {
    // ...implementación si necesitas guardar token / estado...
  }
}
