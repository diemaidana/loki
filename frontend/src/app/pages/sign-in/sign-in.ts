import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from "@angular/forms";
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/service/auth-service';

import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-sign-in',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CardModule,
    DividerModule,
    FloatLabelModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
    Dialog
  ],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn {
  private readonly auth = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  protected visible: boolean = false;

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
      this.visible = true;
      // alert('Email o contraseña inválidos');
    }
  }
}
