import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ApiService } from "src/app/services/api.service";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/app.state";
import * as UsersActions from "src/app/store/users/users.actions";
import { Router } from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  message: string = '';

  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private store: Store<AppState>, private router: Router, private route: ActivatedRoute, private cookieService: CookieService) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
   }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if(params['registered']) {
        this.message = "Registration successful. Please login."
      }
    })
  }

  login() {
    let val = this.loginForm.value;
    this.apiService.login(val).subscribe(res => {
      this.message = res.message;
      
      if(res.message === "User logged in") {
        this.store.dispatch(UsersActions.login({ name: this.cookieService.get('name') }));
        this.router.navigate(['/']);
      }
    })
  }

}
