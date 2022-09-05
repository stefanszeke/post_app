import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostsMainComponent } from "./components/posts-main/posts-main.component";

const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: 'main', component: PostsMainComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
