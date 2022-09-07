import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { ApiService } from '../../services/api.service'
import { Post } from "../../models/post";
import { ActivatedRoute } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: 'app-posts-main',
  templateUrl: './posts-main.component.html',
  styleUrls: ['./posts-main.component.scss']
})
export class PostsMainComponent implements OnInit {
  posts: Post[] = [];
  editMode:boolean = false;

  constructor(private apiService: ApiService, private route: ActivatedRoute, private cookieService: CookieService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if(params['userPosts']) {
        this.apiService.getUserPosts(this.cookieService.get("name")).subscribe(res => { this.posts = res; this.editMode = true })
      } else {
        this.apiService.getPosts().subscribe(res => { this.posts = res; this.editMode = false }) ;
      }
    })
  }

}
