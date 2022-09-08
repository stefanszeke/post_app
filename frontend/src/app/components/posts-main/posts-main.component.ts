import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { ApiService } from '../../services/api.service'
import { Post } from "../../models/post";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/app.state";

@Component({
  selector: 'app-posts-main',
  templateUrl: './posts-main.component.html',
  styleUrls: ['./posts-main.component.scss']
})
export class PostsMainComponent implements OnInit {
  posts: Post[] = [];
  editMode:boolean = false;
  isLoggedIn$: Observable<boolean> = this.store.select(state => state.users.isLoggedIn);
  upvoted: any[] = [];
  downvoted: any[] = [];

  constructor(private apiService: ApiService, private route: ActivatedRoute, private cookieService: CookieService, private router: Router, private store: Store<AppState>) { }

  ngOnInit(): void {
    this.isLoggedIn$.subscribe(res => {
      if(res) {
        this.apiService.getUserVotes().subscribe(res => { this.upvoted.push(...res.upvoted); this.downvoted.push(...res.downvoted) });
      }
    })
    this.route.queryParams.subscribe(params => {
      if(params['userPosts']) {
        this.apiService.getUserPosts(this.cookieService.get("name")).subscribe(res => { this.posts = res; this.editMode = true })
      } else {
        this.apiService.getPosts().subscribe(res => { this.posts = res; this.editMode = false }) ;
      }
    })
  }

  deletePost(id: number) {
    this.apiService.deletePost(id).subscribe(res => {
      if(res.message === "Post deleted") {
        window.location.reload();
      }
    })
  }

  votePost(event:any) {
    this.apiService.votePost(event.id,event.vote).subscribe(res => {
      if(res.message === "Post voted") {
        window.location.reload();
      }
    })
  }

}
