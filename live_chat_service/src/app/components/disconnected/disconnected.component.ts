import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-disconnected',
  templateUrl: './disconnected.component.html',
  styleUrl: './disconnected.component.css'
})
export class DisconnectedComponent {

  constructor(private router: Router){

  }

  backtoChat(e: any){
    this.router.navigate(['/loginPage']).then(() => {
      window.location.reload();
    });
  }

}
