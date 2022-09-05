import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { PostsMainComponent } from './components/posts-main/posts-main.component';
import { PostItemComponent } from './components/post-item/post-item.component';
import { RegisterComponent } from './components/register/register.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LoginComponent } from './components/login/login.component';
import { StoreModule } from '@ngrx/store';
import { usersReducer } from "./store/users/users.reducers";
import { PostFormComponent } from './components/post-form/post-form.component';
import { AuthInterceptor } from "./http-interceptors/auth.interceptor";



@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    PostsMainComponent,
    PostItemComponent,
    RegisterComponent,
    LoginComponent,
    PostFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot({users: usersReducer}, {})
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
