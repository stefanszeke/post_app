import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {
  postForm: FormGroup;
  message: string = '';

  constructor(private formBuilder: FormBuilder, private apiService: ApiService) {
    this.postForm = this.formBuilder.group({
      title: ['', Validators.required],
      text: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  submitPost() {
    let post = this.postForm.value;
    this.apiService.addPost(post).subscribe(res => {
      if(res.message === "Post created") {
        this.postForm.reset();
        this.message = "Post created";
      }
    })
  }

}
