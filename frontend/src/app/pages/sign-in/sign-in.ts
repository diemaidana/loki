import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../auth/service/auth-service';
import { HttpErrorResponse } from '@angular/common/http';
import { ProblemDetail } from '../../core/errors/problem-detail';

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
  private readonly route = inject(ActivatedRoute);

  protected isLoading = signal(false);
  protected errorMessage = signal<string | null>(null);

  protected errorVisible = signal(false);

  readonly formSignIn = this.formBuilder.nonNullable.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(8)]]
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
  
handleSubmit() {
    if (this.formSignIn.invalid) {
      this.formSignIn.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorVisible.set(false); // Reiniciar estado del popup

    const rawValues = this.formSignIn.getRawValue();
    const email = rawValues.email.trim();
    const password = rawValues.password;

    // Nos suscribimos al Observable del login
    this.auth.login(email, password).subscribe({
      next: () => {
      
        this.isLoading.set(false);
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] ?? '/';
        this.router.navigateByUrl(returnUrl.startsWith('/') ? returnUrl : '/');
        
      },
      error: (err: HttpErrorResponse) => {
        
        console.error(err);
        this.isLoading.set(false);
        this.errorVisible.set(true);        
        this.errorMessage.set(this.messageFor(err));
      }
    });
  }
    // ← fin de handleSubmit

  private messageFor(err: HttpErrorResponse): string {
    const problem = err.error as ProblemDetail | null;

    switch (err.status) {
      case 0:   return 'No se pudo conectar con el servidor.';
      case 400: return problem?.detail ?? 'Revisá los datos ingresados.';
      case 401: return 'Email o contraseña incorrectos.';
      case 423: return problem?.detail ?? 'La cuenta está bloqueada temporalmente.';
      default:  return 'Ocurrió un error inesperado. Intentá más tarde.';
    }
  }
} 
