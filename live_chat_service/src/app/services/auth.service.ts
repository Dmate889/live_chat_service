import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://172.105.89.169:3000/auth/register';

  constructor(private http: HttpClient) 
  {

  }

  registerUser(username: string, password: string): Observable<any>{
    const body = { username, password };
    return this.http.post(this.apiUrl, body);
  }
}
