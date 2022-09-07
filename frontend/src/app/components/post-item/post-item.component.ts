import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Post } from "../../models/post";
import { Router } from "@angular/router";


@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss']
})
export class PostItemComponent implements OnInit {
  @Input() post!: Post;
  @Input() editMode: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {}

  goToEditPost() {
    this.router.navigate(['/post'], { queryParams: { id: this.post.id } });
  }
}
