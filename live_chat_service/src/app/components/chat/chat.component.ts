import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Router } from '@angular/router';
import { ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chat_component_logic } from './chat_component_logic';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  //The messages are stored in the messages array, coming from the backend and it will be processed in the static HTML
  messages: { content: string; sender: string; timestamp: Date }[] = [];
  userRec: { name: string; createdAt: Date }[] = [];
  userRecAll: {name: string; createdAt: Date; state: string}[] = [];
  newMessage: string = '';
  lastMessageTimestamp: number = 0;
  currentTime: number = Date.now();
  cooldownTime: number = 300;
  showSmileyDropdown = false;
  userPanelOnline = true;
  userPanelAll = false;

  constructor(protected chatService: ChatService, protected router: Router, protected http: HttpClient, protected chatLogic: Chat_component_logic) {}

  ngOnInit() {

    this.chatLogic.getChatMessages(this.messages, this.chatService);
    this.chatLogic.getChatUsers(this.userRec, this.userRecAll, this.chatService);
    this.chatLogic.getMessgaesFromEndpoint(this.messages);
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

    this.chatLogic.sendChatMessages(this.currentTime,this.lastMessageTimestamp,this.cooldownTime,this.newMessage,this.chatService)
    this.newMessage = '';
    this.scrollToBottom();
  }

  disconnectUser(e: any) {
    this.chatService.closeConnection();
    localStorage.removeItem('jwtToken');
    this.router.navigate(['/loginPage']);
  }

  //This will set the actual scrolling position of the messagecontainer to the scrolling height, which is the last scrolling position, so we will always see the last message without scrolling
  scrollToBottom(): void {
    this.messageContainer.nativeElement.scrollTop =
      this.messageContainer.nativeElement.scrollHeight;
  }

  characterCounter() {
    let inputField = <HTMLInputElement>document.getElementById('message');
    let maxChars = 255;
    let counter = document.getElementById('maxChars');

    if (inputField && counter) {
      let remainingChars = maxChars - inputField.value.length;
      counter.textContent = `Remaining: ${remainingChars}`;
      if (remainingChars < 0) counter.textContent = `Remaining: 0`;
    }
  }

  userPanelSwitchOnline(){
    this.userPanelAll = false;
    this.userPanelOnline = true;
  }

  userPanelSwitchAll(){
    this.userPanelOnline = false;
    this.userPanelAll = true;
  }

  isSmallScreen(){
    return window.innerWidth <= 1024;
  }

  navigateToUserPanel(e: any){
    this.router.navigate(['/userPanel']);
  }
}
