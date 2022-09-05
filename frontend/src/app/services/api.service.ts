import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Post } from "../models/post";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url = 'http://localhost:3700/api';

  constructor(private http: HttpClient) { }

  getPosts():Observable<Post[]> {
    return this.http.get<Post[]>(`${this.url}/posts`);
  }
}
