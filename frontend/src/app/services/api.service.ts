import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Post } from "../models/post";
import { Votes } from "../models/votes";

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

  getUserVotes(): Observable<Votes> {
    return this.http.get<any>(`${this.url}/users/votes`, this.options);
  }

  // posts
  getPosts():Observable<Post[]> {
    return this.http.get<Post[]>(`${this.url}/posts`);
  }

  getUserPosts(name: string):Observable<Post[]> {
    return this.http.get<Post[]>(`${this.url}/posts/${name}`);
  }

  getPostById(name: string, id:number):Observable<Post> {
    return this.http.get<Post>(`${this.url}/posts/${name}?id=${id}`);
  }

  addPost(post: Post): Observable<any> {
    return this.http.post<Post>(`${this.url}/posts`, post, this.options);
  }

  updatePost(update: Post, id: number): Observable<any> {
    return this.http.patch<Post>(`${this.url}/posts/${id}`, update, this.options);
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete<Post>(`${this.url}/posts/${id}`, this.options);
  }

  votePost(id: number, vote:string): Observable<any> {
    return this.http.patch<any>(`${this.url}/posts/${id}/vote`,{vote}, this.options);
  }
}
