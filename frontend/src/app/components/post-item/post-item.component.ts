import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Post } from "../../models/post";
import { Router } from "@angular/router";
import { ApiService } from "src/app/services/api.service";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/app.state";
import { Observable } from "rxjs";

import {faCircleUp, faCircleDown  } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss']
})
export class PostItemComponent implements OnInit {
  @Input() post!: Post;
  @Input() editMode: boolean = false;
  @Input() classUp: boolean = false;
  @Input() classDown: boolean = false;
  @Output() onDeletePost: EventEmitter<number> = new EventEmitter<number>();
  @Output() onVotePost: EventEmitter<any> = new EventEmitter<any>();

  isLoggedIn$: Observable<boolean> = this.store.select(state => state.users.isLoggedIn);

  faCircleUp = faCircleUp;
  faCircleDown = faCircleDown;


  constructor(private router: Router, private apiService: ApiService, private store:Store<AppState>) { }

  ngOnInit(): void {}

  goToEditPost() {
    this.router.navigate(['/post'], { queryParams: { id: this.post.id } });
  }

  deletePost() {
    this.onDeletePost.emit(this.post.id);
  }

  upvote() {
    this.onVotePost.emit({id:this.post.id, vote:'up'});
  }

  downvote() {
    this.onVotePost.emit({id:this.post.id, vote:'down'});
  }

}
