import { Component, OnInit } from '@angular/core';
import { ChatComponent } from '../chat/chat.component';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrl: './user-panel.component.css'
})
export class UserPanelComponent extends ChatComponent implements OnInit{
 override userRec: { name: string; createdAt: Date }[] = [];
 override userRecAll: {name: string; createdAt: Date; state: string}[] = [];

 constructor(override chatService: ChatService, override router: Router, override http: HttpClient){
   super(chatService, router, http);
 }

 override ngOnInit(): void {
  super.getUsersInfo().subscribe({
    next: (response: any) => {
      this.userRec = response.onlineUsers.map((user: any) => ({
        name: user.name,
        createdAt: new Date(user.createdAt),
      }));

      this.userRecAll = response.allUsers.map((user: any) => ({
        name: user.name,
        createdAt: new Date(user.createdAt),
        state: user.state,
      }));
    },
    error: (err: any) => {
      console.error('Error fetching user data:', err);
    },
  });
}

//Implemented methods, so this component will not deal with the ngAfterVewChecked which is part of the parent class
  override ngAfterViewChecked(): void {}
  override scrollToBottom(): void {}

  backToChat(e: any){
    this.router.navigate(['/chat']);
  }

}
