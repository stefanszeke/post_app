import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ApiService } from "src/app/services/api.service";
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

  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private route: ActivatedRoute, private cookieService: CookieService) {
    this.postForm = this.formBuilder.group({
      title: ['', Validators.required],
      text: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log(params);
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
      if(res.message === "Post created") {
        this.postForm.reset();
        this.message = "Post created";
      }
    })
  }

  editPost() {
    
  }

}
