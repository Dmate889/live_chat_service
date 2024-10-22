import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'http://localhost:3000/login';

  constructor(private http: HttpClient) { }

  loginUsers(username: string, password: string): Observable<any>{
    const body = { username, password };
    return this.http.post(this.apiUrl, body);
  }
}