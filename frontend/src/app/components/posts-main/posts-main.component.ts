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

import { faForward, faBackward,faMagnifyingGlass, faUpLong, faDownLong, faSearch, faX } from '@fortawesome/free-solid-svg-icons';



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

  filter: any = {orderBy: 'posts.id', order: 'DESC', search: ''}

  search: string = ""

  faForward = faForward; faBackward = faBackward; faMagnifyingGlass = faMagnifyingGlass; faUpLong = faUpLong; faDownLong = faDownLong; faSearch = faSearch; faX = faX;


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
      if(res.message === "Post voted") { this.getVotes(); this.getPosts() }
    })
  }

  getPage() {
    this.currentPage = +this.selectPage
    this.getPosts()
  }

  nextPage(){
    this.posts$.subscribe(posts => {
      if(posts.length === 5) {
        this.currentPage++;
        this.selectPage = this.currentPage;
        this.getPosts()
      }
    }).unsubscribe()
  }

  prevPage(){
    if(this.currentPage > 1) {
      this.currentPage--;
      this.selectPage = this.currentPage;
      this.getPosts()
    }
  }

  order(orderBy: string, order: string) {
    this.filter.orderBy = orderBy;
    this.filter.order = order;
    this.getPosts()
  }

  orderIsSelected(orderBy: string, order: string) {
    if (this.filter.orderBy === orderBy && this.filter.order === order) { return true }
    return false
  }

  searchPost() {
    this.filter.search = this.search;
    this.resetPage()
    this.getPosts()
  }

  resetSearchAndGetPosts() {
    this.resetSearch()
    this.getPosts()
  }

  switchMode() {
    this.route.queryParams.subscribe(params => {
      this.resetPage()
      this.resetSearch()
      this.resetFilters()
      if(params['userPosts']) {
        this.editMode = true;
        this.getPosts();
      } else {
        this.editMode = false;
        this.getPosts()
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

  getPosts() {
    if(this.editMode) { this.store.dispatch(PostsActions.requestUserPosts(this.currentPage,this.filter.orderBy,this.filter.order,this.filter.search)) }
    else { this.store.dispatch(PostsActions.requestPosts(this.currentPage,this.filter.orderBy,this.filter.order,this.filter.search)) }
  }

  resetSearch() {
    this.filter.search = '';
    this.search = '';
  }

  resetFilters() {
    this.filter.orderBy = 'posts.id';
    this.filter.order = 'DESC';
  }

  resetPage() {
    this.currentPage = 1;
    this.selectPage = 1;
  }

}
