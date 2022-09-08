import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ApiService } from "src/app/services/api.service";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {
  postForm: FormGroup;
  message: string = '';
  editMode: boolean = false;


  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private route: ActivatedRoute, private cookieService: CookieService, private router: Router) {
    this.postForm = this.formBuilder.group({
      title: ['', Validators.required],
      text: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if(params['id']) {
        this.apiService.getPostById(this.cookieService.get('name'),params['id']).subscribe(res => {
          this.postForm.setValue({
            title: res.title,
            text: res.text
          })
          this.editMode = true;
        })
      } else {
        this.editMode = false;
      }
    })
  }

  submitPost() {
    let post = this.postForm.value;
    this.apiService.addPost(post).subscribe(res => {
      this.message = res.message;
      if(res.message === "Post created") {
        this.router.navigate(['/main'], { queryParams: {userPosts: true} });
      }
    })
  }

  editPost() {
    this.route.queryParams.subscribe(params => {
      let post = this.postForm.value;
      this.apiService.updatePost(post,params['id']).subscribe(res => {
        if(res.message === "Post updated") {
          this.router.navigate(['/main'], { queryParams: {userPosts: true} });
        }
      })
    });
  }

}
