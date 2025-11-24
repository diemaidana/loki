import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  private readonly route = inject(ActivatedRoute);

  protected isLoading = signal(false);
  protected errorMessage = signal<string | null>(null);

  protected errorVisible = signal(false);

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
  
handleSubmit() {
    if (this.formSignIn.invalid) {
      this.formSignIn.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorVisible.set(false); // Reiniciar estado del popup

    const rawValues = this.formSignIn.getRawValue();
    const email = rawValues.email.trim();
    const password = rawValues.password.trim();

    // Nos suscribimos al Observable del login
    this.auth.login(email, password).subscribe({
      next: () => {
        // ✅ Login exitoso
        this.isLoading.set(false);
        
        // Redirigir a la URL de retorno (si existe) o al Home
        this.router.navigateByUrl("/");
      },
      error: (err) => {
        // ❌ Login fallido
        console.error(err);
        this.isLoading.set(false);
        this.errorVisible.set(true);        
        this.errorMessage.set('Credenciales inválidas. Intente nuevamente.');
      }
    });
  }
}
