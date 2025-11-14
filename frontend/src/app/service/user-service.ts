import { inject, Injectable } from '@angular/core';
import { User } from '../model/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly urlApi = "http://localhost:3000/users";
  // Get
  getUsers(){
    return this.http.get<User[]>(this.urlApi);
  }
  getUserById(id: string | number){
    return this.http.get<User[]>(`${this.urlApi}/${id}`);
  }

  postUser(user: User){
    return this.http.post<User>(`${this.urlApi}`, user);
  }
}
