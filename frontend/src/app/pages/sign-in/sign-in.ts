import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  private readonly route = inject(ActivatedRoute);

  protected isLoading = signal(false);
  protected errorMessage = signal<string | null>(null);

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
    this.errorMessage.set(null);

    const { email, password } = this.formSignIn.getRawValue();

    // Nos suscribimos al Observable del login
    this.auth.login(email, password).subscribe({
      next: () => {
        // ✅ Login exitoso
        this.isLoading.set(false);
        
        // Redirigir a la URL de retorno (si existe) o al Home
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        void this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        // ❌ Login fallido
        console.error(err);
        this.isLoading.set(false);
        this.errorMessage.set('Credenciales inválidas. Intente nuevamente.');
      }
    });
  }
}
