import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Post } from "../../models/post";
import { Router } from "@angular/router";
import { ApiService } from "src/app/services/api.service";


@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss']
})
export class PostItemComponent implements OnInit {
  @Input() post!: Post;
  @Input() editMode: boolean = false;
  @Output() onDeletePost: EventEmitter<number> = new EventEmitter<number>();

  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit(): void {}

  goToEditPost() {
    this.router.navigate(['/post'], { queryParams: { id: this.post.id } });
  }

  deletePost() {
    this.onDeletePost.emit(this.post.id);
  }

}
