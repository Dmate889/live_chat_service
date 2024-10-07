import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

//Async two-way WS connection
  private socket$: WebSocketSubject<any>;

  constructor() {
    this.socket$ = new WebSocketSubject({
      url: 'ws://localhost:8080',
      deserializer: msg => msg.data,
      serializer: msg => JSON.stringify(msg)
    });
   }


//Sending messages to the WS server from the front-end
  sendMessage(msg: string) {
    this.socket$.next(msg);
  }

//Getting the messages and converting those as Observables for socket$ WS subject
  getMessages() {
    return this.socket$.asObservable();
  }
}
