import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  

  constructor(private router: Router, private loginservice: LoginService){
    
  }

  register(e: any){
    this.router.navigate(['/registerPage']);
  }

  loginUser(e:any){
    e.preventDefault();
    const userName = e.target.elements.username.value.trim();
    const passWord = e.target.elements.password.value.trim();

      this.loginservice.loginUsers(userName,passWord).subscribe(
        response => {
          console.log('User logged in successfully', response);
          
          const token = response.token;
          localStorage.setItem('jwtToken', token);
  
          this.router.navigate(['/chat']);
        },
        error => {
          if(error.status === 401) alert('Invalid username or password!');
        }
      )    
  }
}
