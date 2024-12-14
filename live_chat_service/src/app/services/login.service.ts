import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'https://l1node4fun.xyz/auth/login';

  constructor(private http: HttpClient) { }

  loginUsers(username: string, password: string): Observable<any>{
    const body = { username, password };
    return this.http.post(this.apiUrl, body);
  }
}
