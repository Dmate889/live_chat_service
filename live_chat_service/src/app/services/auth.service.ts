import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://l1node4fun.xyz/auth/register';

  constructor(private http: HttpClient) 
  {

  }

  registerUser(username: string, password: string): Observable<any>{
    const body = { username, password };
    return this.http.post(this.apiUrl, body);
  }
}
