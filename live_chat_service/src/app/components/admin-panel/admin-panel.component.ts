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

  setUserIsActive(userName: string, isActive: number) {
    const apiUrl = 'http://localhost:3000/auth/isactive';
    const body = {userName, isActive};
    return this.http.post(apiUrl,body);
  }

  //Problem needs to be fixed: How to give the given record's username and isActive state to setUserIsactive - endpoint, and patch the isActive state real time on frontend and backend too. 

  //Mocking ban mechanism
  // banUsers(){

  //   const button = document.getElementById('buttonIsActive');
    
  //   this.userIsactive = !this.userIsactive;
  //   if(button && this.userIsactive === false){
  //     button.textContent = 'Banned';
  //   }
  //   else if(button && this.userIsactive === true){
  //     button.textContent = 'Active';
  //   }

  // }

}
