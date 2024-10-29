import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service'; 
import { Router } from '@angular/router';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

//The messages are stored in the messages array, coming from the backend and it will be processed in the static HTML
  messages: {content: string, sender: string} [] = []; 
  newMessage: string = ''; 
  lastMessageTimestamp: number = 0;
  cooldownTime: number = 300;

  

  constructor(private chatService: ChatService, private router: Router) {}

  ngOnInit(){
    this.chatService.getMessages().subscribe((message: any) => {
      
      this.messages.push({
        content: typeof message.content === 'object' ? JSON.stringify(message.content) : message.content,
        sender: message.sender
      });
    });
  }

//The messages that we send to the WS server 
  sendMessage(event: Event) {
    event.preventDefault();
    const currentTime = Date.now();
    
//Spam protection
  if(currentTime - this.lastMessageTimestamp < this.cooldownTime) return alert('If you keep spamming, you will be disconnected from the server')

//if the message is empty, it can not be sent
    if(this.newMessage.trim() === '')
    {
      alert("You can't send empty messages.");  
      return;
    }
      const message = {
        content: this.newMessage
      }

    this.chatService.sendMessage(JSON.stringify(message));
    //Setting the message timestamp to date.now() again
    this.lastMessageTimestamp = currentTime;
  }

  disconnectUser(e: any){
    this.chatService.closeConnection();
    localStorage.removeItem('jwtToken');
    this.router.navigate(['/loginPage']);
  }
}


