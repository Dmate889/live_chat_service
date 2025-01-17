import { Component, OnInit } from '@angular/core';
import { ChatComponent } from '../chat/chat.component';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { HttpClient } from '@angular/common/http';
import { Chat_component_logic } from '../chat/chat_component_logic';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrl: './user-panel.component.css'
})
export class UserPanelComponent extends ChatComponent implements OnInit{
 override userRec: { name: string; createdAt: Date }[] = [];
 override userRecAll: {name: string; createdAt: Date; state: string, isActive: number}[] = [];

 constructor(override chatService: ChatService, override router: Router, override http: HttpClient, chatLogic: Chat_component_logic){
   super(chatService, router, http, chatLogic);
 }

 override ngOnInit(): void {

  this.chatLogic.getChatUsersUserPanel(this.userRec, this.userRecAll);
}

//Implemented methods, so this component will not deal with the ngAfterVewChecked which is part of the parent class
  override ngAfterViewChecked(): void {}
  override scrollToBottom(): void {}

  backToChat(){
    this.router.navigate(['/chat']);
  }

 override navigateToAdminPanel(){

    this.router.navigate(['/adminPanel']);
  }

}