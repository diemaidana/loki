import { inject, Injectable } from '@angular/core';
import { User } from '../model/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly urlApi = " http://localhost:3000/users";
  
  // Get
  getUsers(){
    return this.http.get<User[]>(this.urlApi);
  }
  getUserById(id: string | number){
    return this.http.get<User[]>(`${this.urlApi}/${id}`);
  }

  postUser(user: User): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<User>(this.urlApi, user, { headers, withCredentials: false })
      .pipe(
        catchError(err => {
          console.error('UserService.postUser error:', err);
          return throwError(() => err);
        })
      );
  }
  updateUser(id: string | number, user: Partial<User>): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<User>(`${this.urlApi}/${id}`, user, { headers, withCredentials: false })
      .pipe(
        catchError(err => {
          console.error('UserService.updateUser error:', err);
          return throwError(() => err);
        })
      );
  }

  deleteUser(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.urlApi}/${id}`, { withCredentials: false })
      .pipe(
        catchError(err => {
          console.error('UserService.deleteUser error:', err);
          return throwError(() => err);
        })
      );
  }
}
