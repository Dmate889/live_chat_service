import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { DisconnectedComponent } from './components/disconnected/disconnected.component';
import { LoginPageComponent } from './components/login-page/login-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/loginPage', pathMatch: 'full' },
  {path: 'chat', component: ChatComponent},
  {path: 'disconnected', component: DisconnectedComponent},
  {path: 'loginPage', component: LoginPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
