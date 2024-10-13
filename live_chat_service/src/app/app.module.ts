import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './components/chat/chat.component';
import { FormsModule } from '@angular/forms';
import { DisconnectedComponent } from './components/disconnected/disconnected.component';
import { LoginPageComponent } from './components/login-page/login-page.component';




@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    DisconnectedComponent,
    LoginPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
