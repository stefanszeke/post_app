import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { COUNTRIES } from "src/app/countries";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  countries = COUNTRIES;
  message: string =''

  constructor(private formBuilder: FormBuilder, private apiService: ApiService) {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      country: ['', Validators.required],
      password: ['', [Validators.required]],
      confirm: ['', [Validators.required]]
    });
  }
   

  ngOnInit(): void {

  }

  register() {
    let val = this.registerForm.value;

    this.apiService.register(val).subscribe(res => {
      this.message = res.message;
      if(res.message === "User created") {
        this.registerForm.reset();
      }
    })

  }



}
