import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, switchMap } from 'rxjs';
import { AuthService } from '../../auth/service/auth-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { UserService } from '../../service/user-service';
import { User } from '../../model/user';

import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  imports: [
    ConfirmDialogModule,
    ButtonModule,
    ToastModule,
    IconFieldModule,
    ReactiveFormsModule,
    FormsModule,
    PasswordModule,
    CardModule,
    InputTextModule,
    FloatLabelModule
  ],
  providers: [
    ConfirmationService,
    MessageService
  ],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile {

  private readonly profileFormEdit = inject(FormBuilder);
  private readonly service = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  // Signals para el estado
  isLoading = signal<boolean>(true);
  currentUser = signal<User | null>(null);

  private readonly userSource$ = this.route.paramMap.pipe(
    map(params => params.get('id')),
    filter((id): id is string => !!id),
    switchMap(id => this.service.getUserById(id)) 
  );

  private readonly userResource = toSignal(this.userSource$, { initialValue: null });
  userForm = signal<User | null>(null);

  // Formulario Reactivo
  profileForm = this.profileFormEdit.group({
/*     username: ['', Validators.required], */
    email: ['', [Validators.required, Validators.email]],
    fullName: ['', Validators.required],
    password: ['', Validators.required],
    DNI: [''],
    phoneNumber: [''],
    address: [''],
    nationality: [''],
    isSeller: [false]
  });

  ngOnInit() {
    this.authService.userState$.subscribe(user => {
      if (user) {
        this.currentUser.set(user);
        this.patchForm(user);
        this.isLoading.set(false);
      }
    });
  }

  // Rellenar formulario con datos existentes
  private patchForm(user: User) {
    this.profileForm.patchValue({
/*       username: user.username, */
      email: user.email,
      fullName: user.fullName,
      password: user.password,
      DNI: user.DNI || '',
      phoneNumber: user.phoneNumber || '',
      address: user.address || '',
      nationality: user.nationality || '',
      isSeller: user.isSeller || false
    });
  }

  initiateSave() {
    if (this.profileForm.invalid) {
        this.messageService.add({severity:'error', summary:'Error', detail:'Formulario inválido'});
        return;
    }

    this.confirmationService.confirm({
      header: 'Confirmar Edición',
      message: '¿Estás seguro de que deseas guardar los cambios?',
      icon: 'pi pi-exclamation-triangle',
      
      accept: () => {

        this.saveData();
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Cancelado', detail: 'No se realizaron cambios' });
        if (this.currentUser()) {
            this.patchForm(this.currentUser()!);
        }
      }
    });
  }

   private saveData() {
    if (!this.currentUser()) return;
    
    this.isLoading.set(true);
    const formValue = this.profileForm.getRawValue();

    this.service.updateUser(this.currentUser()!.id!, formValue as any).subscribe({
      next: (updatedUser) => {
        this.currentUser.set(updatedUser);
        this.patchForm(updatedUser);
        this.isLoading.set(false);
        this.authService.updateCurrentUser(updatedUser);
        console.log("Mostrar mensaje");
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Perfil actualizado' });
      },
      error: (err) => {
        this.isLoading.set(false);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar' });
      }
    });
  }
}
