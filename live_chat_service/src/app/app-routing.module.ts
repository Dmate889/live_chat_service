import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { DisconnectedComponent } from './disconnected/disconnected.component';

const routes: Routes = [
  { path: '', redirectTo: '/chat', pathMatch: 'full' },
  {path: 'chat', component: ChatComponent},
  {path: 'disconnected', component: DisconnectedComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
