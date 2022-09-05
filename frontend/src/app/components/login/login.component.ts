import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  message: string = '';

  constructor(private formBuilder: FormBuilder, private apiService: ApiService) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
   }

  ngOnInit(): void {
  }

  login() {
    let val = this.loginForm.value;
    this.apiService.login(val).subscribe(res => {
      this.message = res.message;
      console.log(res)
      if(res.message === "User logged in") {
        localStorage.setItem('token', res.token);
        localStorage.setItem('name', res.name);
        this.loginForm.reset();
      }
    })
  }

}
