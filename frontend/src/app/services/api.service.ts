import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Post } from "../models/post";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    withCredentials: true
  };

  url = 'http://localhost:3700/api';

  constructor(private http: HttpClient) { }

  // users
  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.url}/users/register`, user, this.options);
  }
  
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.url}/users/login`, credentials, this.options);
  }

  // posts
  getPosts():Observable<Post[]> {
    return this.http.get<Post[]>(`${this.url}/posts`);
  }

  addPost(post: Post): Observable<any> {
    return this.http.post<Post>(`${this.url}/posts`, post, this.options);
  }
}
