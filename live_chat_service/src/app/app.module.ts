import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './components/chat/chat.component';
import { FormsModule } from '@angular/forms';
import { DisconnectedComponent } from './components/disconnected/disconnected.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserPanelComponent } from './components/user-panel/user-panel.component';




@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    DisconnectedComponent,
    LoginPageComponent,
    RegisterPageComponent,
    UserPanelComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
