import { Component, OnInit } from '@angular/core';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrl: './user-panel.component.css'
})
export class UserPanelComponent extends ChatComponent implements OnInit{


//Implemented methods, so this component will not deal with the ngAfterVewChecked which is part of ChatComponent
  override ngAfterViewChecked(): void {}
  override scrollToBottom(): void {}

}
