import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Chat_component_logic {
  constructor(private http: HttpClient) {}

  getChatMessages(messages: any[], chatService: any) {
    chatService.getMessages().subscribe((message: any) => {
      if (message.content) {
        messages.push({
          content:
            typeof message.content === 'object'
              ? JSON.stringify(message.content)
              : message.content,
          sender: message.sender,
          timestamp: message.timestamp,
        });
      }
    });
  }

  getChatUsers(userRec: any[], userRecAll: any[], chatService: any) {
    chatService.getUserList().subscribe((response: any[]) => {
      if (Array.isArray(response)) {
        userRec.splice(
          0,
          userRec.length,
          ...response.map((user) => ({
            name: user.name,
            createdAt: user.createdAt,
          }))
        );
      } else {
        console.error('Unexpected user list format:', response);
      }
    });

    chatService.getUserListAll().subscribe((response: any[]) => {
      if (Array.isArray(response)) {
        userRecAll.splice(
          0,
          userRecAll.length,
          ...response.map((user) => ({
            name: user.name,
            createdAt: user.createdAt,
            state: user.state,
            isActive: user.isActive
          }))
        );
      } else {
        console.error('Unexpected userAll list format:', response);
      }

      userRecAll.map((user => {
        console.log('The user object JSOn on frontend: '+ JSON.stringify(user));
      }))
    });
  }

  getMessgaesFromEndpoint(messages: any[]) {
    this.getMesagesAgain().subscribe(
      (response: any) => {
        response.newMessages.forEach((message: any) => {
          messages.push({
            content: message.content,
            sender: message.name,
            timestamp: message.timestamp,
          });
        });
      },
      (error) => {
        console.error('Error fetching messages again:', error);
      }
    );
  }

  getMesagesAgain() {
    const apiUrl = 'http://localhost:3000/auth/messages';
    return this.http.get(apiUrl);
  }

  sendChatMessages(
    currentTime: any,
    lastMessageTimestamp: number,
    cooldownTime: number,
    newMessage: any,
    chatService: any
  ) {
    this.spamProtection(
      currentTime,
      lastMessageTimestamp,
      cooldownTime,
      newMessage
    );

    const message = {
      content: newMessage,
      timestamp: currentTime,
    };

    chatService.sendMessage(JSON.stringify(message));
    lastMessageTimestamp = currentTime;
    newMessage = '';
  }

  spamProtection(
    currentTime: any,
    lastMessageTimestamp: number,
    cooldownTime: number,
    newMessage: any
  ) {
    if (currentTime - lastMessageTimestamp < cooldownTime)
      return alert(
        'If you keep spamming, you will be disconnected from the server'
      );
    if (newMessage.trim() === '') {
      alert("You can't send empty messages.");
      return;
    }

    if (newMessage.length > 255) {
      alert('You have reached the character limit of 255');
      return;
    }
  }

  getUsersInfo() {
    const apiUrl = 'http://localhost:3000/auth/query';
    return this.http.get(apiUrl);
  }

  getChatUsersUserPanel(userRec: any[], userRecAll: any[]) {
    this.getUsersInfo().subscribe({
      next: (response: any) => {
        userRec.splice(
          0,
          userRec.length,
          ...response.onlineUsers.map((user: any) => ({
            name: user.name,
            createdAt: new Date(user.createdAt),
          }))
        );

        userRecAll.splice(
          0,
          userRecAll.length,
          ...response.allUsers.map((user: any) => ({
            name: user.name,
            createdAt: new Date(user.createdAt),
            state: user.state,
            isActive: user.isActive
          }))
        );
      },
      error: (err: any) => {
        console.error('Error fetching user data:', err);
      },
    });
  }
}
