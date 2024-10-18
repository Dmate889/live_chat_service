import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service'; 
import { Router } from '@angular/router';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

//For now, the messages are stored in the messages array
  messages: string[] = []; 
  newMessage: string = ''; 
  lastMessageTimestamp: number = 0;
  cooldownTime: number = 300;

  

  constructor(private chatService: ChatService, private router: Router) {}

  ngOnInit(){
    //Getting messages from the WS server, if the message string, it can be pushed to the array, of it is Blob, it will be converted by text(), which gives back a Promise, and with then() we wait for that, then we push it to the array.
        this.chatService.getMessages().subscribe((message: any) => {
          if(typeof message === 'string'){
            this.messages.push(message);
          }
          else if(message instanceof Blob){
            message.text().then(text => this.messages.push(text));
          }
        })
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

    this.chatService.sendMessage(this.newMessage);
    this.newMessage = ''; 
    
    //Setting the message timestamp to date.now() again
    this.lastMessageTimestamp = currentTime;
  }

  disconnectUser(e: any){
    localStorage.removeItem('jwtToken');
    this.chatService.closeConnection();

    this.router.navigate(['/loginPage']);
  }
}


