import { inject, Injectable } from '@angular/core';
import { User } from '../model/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  // Get
  getUsers(){
    return this.http.get<User[]>(/* Hay que poner la Api */);
  }
  getUserById(id: string | number){
    return this.http.get<User[]>(`${/* Hay que poner la Api */}/${id}`);
  }

  postUser(user: User){
    return this.http.post<User>(`${/* Hay que poner la Api */}`, user);
  }
}
