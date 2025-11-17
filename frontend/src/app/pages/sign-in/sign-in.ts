import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from "@angular/forms";
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/service/auth-service';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn {
  private readonly auth = inject(AuthService);
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
  
  async handleSubmit(){
    const user = this.formSignIn.getRawValue();
    const ok = await this.auth.login(user.email, user.password);
    if(ok){
      this.router.navigateByUrl('/');

    } else {
      alert('Email o contraseña inválidos');
    }
  }
}
