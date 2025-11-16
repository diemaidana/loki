import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from "@angular/forms";
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly formSignIn = this.formBuilder.nonNullable.group({
    email: ["", [Validators.required]],
    password: ["", [Validators.required]]
  })

  get email(){
    return this.formSignIn.controls.email;
  }

  get password(){
    return this.formSignIn.controls.password;
  }

  get touched(){
    return this.formSignIn.touched;
  }
  
  handleSubmit(){

  }

  navigateTo(){
    this.router.navigateByUrl("/sign-up");
  }
}
