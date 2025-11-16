import { Component, inject } from '@angular/core';
import { UserService } from '../../service/user-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-user-controller',
  imports: [],
  templateUrl: './user-controller.html',
  styleUrl: './user-controller.css',
})
export class UserController {
  private readonly service = inject(UserService);
  protected readonly users = toSignal(this.service.getUsers());


  async validateUserLogin(email: string, password: string): Promise<boolean> {
    try {
      const cached = this.users();
      const list = cached ?? await firstValueFrom(this.service.getUsers());
      return list.some(u => u.email === email && u.password === password);
    } 
    catch (err) {
      console.error('validateUserLogin error', err);
      return false;
    }
  }



  
}
