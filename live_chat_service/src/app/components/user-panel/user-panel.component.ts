import { Component, OnInit } from '@angular/core';
import { ChatComponent } from '../chat/chat.component';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrl: './user-panel.component.css'
})
export class UserPanelComponent extends ChatComponent implements OnInit{

constructor(override chatService: ChatService, override router: Router){
  super(chatService, router);
}

//Implemented methods, so this component will not deal with the ngAfterVewChecked which is part of the parent class
  override ngAfterViewChecked(): void {}
  override scrollToBottom(): void {}

  backToChat(e: any){
    this.router.navigate(['/chat']);
  }

}
