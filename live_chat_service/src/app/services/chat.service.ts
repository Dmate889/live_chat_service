import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

//Async two-way WS connection
  private socket$: WebSocketSubject<any>;
  private token: any;

  constructor(private router: Router) {

    this.token = localStorage.getItem('jwtToken');

    this.socket$ = new WebSocketSubject({
      url: `ws://172.105.89.169:8080?token=${this.token}`,
      deserializer: msg => JSON.parse(msg.data),
      serializer: msg => JSON.stringify(msg)
    });

    this.socket$.subscribe({
      error: (err) => this.handleDisconnect(),
      complete: () => this.handleDisconnect()
    })
   }


//Sending messages to the WS server from the front-end
  sendMessage(msg: string) {
    this.socket$.next(msg);
  }

  private handleDisconnect() {
    console.log('WebSocket connection closed, navigating to disconnected page.');
    localStorage.removeItem('jwtToken');
    this.router.navigate(['/disconnected']);
  }

   closeConnection(){
    if(this.socket$){
      this.socket$.complete();
    }
  }

//Getting the messages and converting those as Observables for socket$ WS subject
  getMessages() {
    return this.socket$.asObservable();
  }
}
