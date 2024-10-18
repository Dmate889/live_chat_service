import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {

  constructor(private router: Router, private authService: AuthService){

  }

  getUserDetails(e:any){
    e.preventDefault();
    const userName = e.target.elements.username.value.trim();
    const passWord = e.target.elements.password.value.trim();

    if(userName === '' || passWord === ''){
      alert('The usernam or password format was incorrect!');
    }
    else{
      this.authService.registerUser(userName,passWord).subscribe(
        response => {
          console.log('User registered successfully', response);
          this.router.navigate(['/loginPage']);
        },
        error => {
          console.error('Error registering user', error);
        }
      )
    }    
  }
}
