import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Post } from "../../models/post";

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss']
})
export class PostItemComponent implements OnInit {
  @Input() post!: Post;

  constructor() { }

  ngOnInit(): void {
  }

}
