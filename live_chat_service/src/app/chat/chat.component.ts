import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service'; 


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

//For now, the messages are stored here
  messages: string[] = []; 
  newMessage: string = ''; 

  constructor(private chatService: ChatService) {}

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
    this.chatService.sendMessage(this.newMessage);
    this.newMessage = ''; 
  }
}
