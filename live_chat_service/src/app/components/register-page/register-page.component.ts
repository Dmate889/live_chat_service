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

  navigateBack($event: any){
    this.router.navigate(['/loginPage']);
  }

  getUserDetails(e:any){
    e.preventDefault();
    const userName = e.target.elements.username.value.trim();
    const passWord = e.target.elements.password.value.trim();

    if(userName === '' || passWord === ''){
      alert('The username or password format is incorrect!');
    }
    else{
      this.authService.registerUser(userName,passWord).subscribe(
        response => {
          console.log('User registered successfully', response);
          alert(`You have registered successfully as ${userName}`);

          this.router.navigate(['/loginPage']);
        },
        error => {
          if(error.status === 500){
            alert('Error: Registration failed, user already exist');
          }
          else console.error('Unknown error occured', error);
        }
      )
    }    
  }
}
