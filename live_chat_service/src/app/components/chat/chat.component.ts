import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service'; 
import { Router } from '@angular/router';
import { ViewChild, ElementRef, AfterViewChecked } from '@angular/core';




@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

//The messages are stored in the messages array, coming from the backend and it will be processed in the static HTML
  messages: {content: string, sender: string, timestamp: Date} [] = []; 
  newMessage: string = ''; 
  lastMessageTimestamp: number = 0;
  cooldownTime: number = 300;
  showSmileyDropdown = false;


  constructor(private chatService: ChatService, private router: Router) {}

  ngOnInit(){
    this.chatService.getMessages().subscribe((message: any) => {
      
      this.messages.push({
        content: typeof message.content === 'object' ? JSON.stringify(message.content) : message.content,
        sender: message.sender,
        timestamp: message.timestamp
      });
      this.newMessage = "";
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggleSmileyDropdown() {
    this.showSmileyDropdown = !this.showSmileyDropdown;
  }


  addSmiley(smiley: string) {
    this.newMessage = (this.newMessage || '') + smiley;
    this.showSmileyDropdown = false; 
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
        content: this.newMessage,
        timestamp: currentTime
      }

    this.chatService.sendMessage(JSON.stringify(message));
    this.lastMessageTimestamp = currentTime;
    this.scrollToBottom();
  }

  disconnectUser(e: any){
    this.chatService.closeConnection();
    localStorage.removeItem('jwtToken');
    this.router.navigate(['/loginPage']);
  }

  //This will set the actual scrolling position of the messagecontainer to the scrolling height, which is the last scrolling position, so we will always see the last message withot scrolling
  scrollToBottom(): void {
    this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
  }
}


