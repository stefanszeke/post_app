import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { ApiService } from '../../services/api.service'
import { Post } from "../../models/post";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/app.state";
import * as PostsActions from "../../store/posts/posts.actions";
import * as VotesActions from "../../store/votes/votes.actions";

import { faForward, faBackward,faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-posts-main',
  templateUrl: './posts-main.component.html',
  styleUrls: ['./posts-main.component.scss']
})
export class PostsMainComponent implements OnInit {
  posts$: Observable<Post[]> = this.store.select(state => state.posts.posts);
  isLoggedIn$: Observable<boolean> = this.store.select(state => state.users.isLoggedIn);
  upvoted$: Observable<string[]> = this.store.select(state => state.votes.upvoted)
  downvoted$: Observable<string[]> = this.store.select(state => state.votes.downvoted);
  
  editMode:boolean = false;
  noPosts: string = ''

  selectPage: number = 1;
  currentPage: number = 1;

  faForward = faForward; faBackward = faBackward; faMagnifyingGlass = faMagnifyingGlass;

  constructor(private apiService: ApiService, private route: ActivatedRoute, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.isLoggedIn$.subscribe(isLoggedIn => {
      if(isLoggedIn) { this.getVotes() }
    })
    this.switchMode();
  }

  deletePost(id: number) {
    this.apiService.deletePost(id).subscribe(res => {
      if(res.message === "Post deleted") { this.switchMode() }
    })
  }

  votePost(event:any) {
    this.apiService.votePost(event.id,event.vote).subscribe(res => {
      if(res.message === "Post voted") { this.switchMode(); this.getVotes() }
    })
  }

  switchMode() {
    this.route.queryParams.subscribe(params => {
      if(params['userPosts']) {
        this.store.dispatch(PostsActions.requestUserPosts());
        this.editMode = true;
      } else {
        this.store.dispatch(PostsActions.requestPosts(1));
        this.editMode = false;
      }
      this.checkIfNoPosts();
    })
  }

  getVotes() {
    this.store.dispatch(VotesActions.requestVotes());
  }

  checkIfNoPosts() {
    this.posts$.subscribe(posts => {
      if(posts.length === 0) {
        if(this.editMode) { this.noPosts = 'You have no posts' } 
        else { this.noPosts = 'There are no posts' }
      } 
      else { this.noPosts = ''}
    })
  }

  getPage(page:number) {
    this.currentPage = +this.selectPage
    this.store.dispatch(PostsActions.requestPosts(page));
    console.log(this.currentPage)
  }

  nextPage(){
    this.posts$.subscribe(posts => {
      if(posts.length === 5) {
        this.currentPage++;
        this.selectPage = this.currentPage;
        this.getPage(this.currentPage);
      }
    }).unsubscribe()
  }

  prevPage(){
    if(this.currentPage > 1) {
      this.currentPage--;
      this.selectPage = this.currentPage;
      this.getPage(this.currentPage);
    }
  }



}
