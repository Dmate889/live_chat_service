import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserPanelComponent } from '../user-panel/user-panel.component';
import { ChatService } from '../../services/chat.service';
import { HttpClient } from '@angular/common/http';
import { Chat_component_logic } from '../chat/chat_component_logic';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent extends UserPanelComponent {

  userAll: {name: string, createdAt: Date, state: string, isActive: number} []= [];
  dummyArray: any [] = [];

  userIsactive = true;

 constructor(override chatService: ChatService, override router: Router, override http: HttpClient, chatLogic: Chat_component_logic){
    super(chatService, router, http, chatLogic);
  }

  override ngOnInit() {
    this.chatLogic.getChatUsersUserPanel(this.dummyArray = [], this.userAll)
  }

  navigateToChat(){
    this.router.navigate(['/chat']);
  }

  //Building API endpoint for patching users isActive state
  // setUserIsActive() {
  //   const apiUrl = 'http://localhost:3000/auth/isactive';
  //   return this.http.post(apiUrl, );
  // }

  //Mocking ban mechanism
  // banUsers(){
  //   this.userIsactive = !this.userIsactive;

  //   const button = document.getElementById('buttonIsActive');

  //   if(button && this.userIsactive){
  //     button.textContent = 'Active';
  //   }
  //   if(button && this.userIsactive === false){
  //     button.textContent = 'Banned';
  //   }
  // }

}
