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
    })
  };

  url = 'http://localhost:3700/api';

  constructor(private http: HttpClient) { }

  getPosts():Observable<Post[]> {
    return this.http.get<Post[]>(`${this.url}/posts`);
  }

  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.url}/users/register`, user, this.options);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.url}/users/login`, credentials, this.options);
  }
}
