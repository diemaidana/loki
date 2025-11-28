import { Component, inject, Input, input, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../model/user';
import { UserService } from '../../service/user-service';
import { Router } from '@angular/router';
import { passwordsMatchValidator } from '../../validator/password-match';

import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from "primeng/inputtext";
import { ConfirmationService, MessageService } from 'primeng/api';
import { Toast } from "primeng/toast";
import { ConfirmDialog } from "primeng/confirmdialog";
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-user-form',
  imports: [
    ReactiveFormsModule,
    CardModule,
    FloatLabelModule,
    FormsModule,
    MessageModule,
    PasswordModule,
    ButtonModule,
    Dialog,
    InputText,
    Toast,
    ConfirmDialog,
    CheckboxModule
],
  providers: [MessageService, ConfirmationService],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm {
  private readonly formBuilder = inject(FormBuilder);
  private readonly service = inject(UserService);
  @Input() protected readonly user?:User;
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  protected visible = signal(false);

  protected readonly nations = [
    "Colombia",
    "Venezuela",
    "Ecuador",
    "Perú",
    "Bolivia",
    "Chile",
    "Argentina",
    "Uruguay",
    "Paraguay",
    "Brasil"
  ];

  get username() {
    return this.formSignUp.controls.username;
  }

  get email() {
    return this.formSignUp.controls.email;
  }

  get password() {
    return this.formSignUp.controls.password;
  }

  get repassword() {
    return this.formSignUp.controls.repassword;
  }

  get fullName() {
    return this.formSignUp.controls.fullName;
  }

  get DNI() {
    return this.formSignUp.controls.DNI;
  }

  get phoneNumber() {
    return this.formSignUp.controls.phoneNumber;
  }

  get address() {
    return this.formSignUp.controls.address;
  }

  get nationality() {
    return this.formSignUp.controls.nationality;
  }
  get isSeller(){
    return this.formSignUp.controls.isSeller;
  }
  get touched(){
    return this.formSignUp.touched;
  }


  protected readonly formSignUp = this.formBuilder.nonNullable.group({
    username: ["", [Validators.required]],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required]],
    repassword: ["", [Validators.required]],
    fullName: ["", [Validators.required]],
    DNI: ["", [Validators.required]],
    phoneNumber: [""],
    address: ["", [Validators.required]],
    nationality: [""],
    isSeller: [false]
  }, { validators: [passwordsMatchValidator]});

  get formControls(){
    return this.formSignUp.controls
  }

  navigateTo(){
    return this.router.navigateByUrl("/");
  }

  handleSubmit(){
    if (this.formSignUp.invalid) {
        this.messageService.add({severity:'error', summary:'Error', detail:'Formulario inválido'});
        return;
    }

    this.confirmationService.confirm({
      header: 'Confirmar Registro',
      message: '¿Estás seguro de que deseas registrarte?',
      icon: 'pi pi-exclamation-triangle',
      


      
      accept: () => {
          const rawValue = this.formSignUp.getRawValue();

      // 🛡️ LIMPIEZA DE DATOS (Sanitización)
      // Creamos un objeto nuevo explícitamente para evitar referencias circulares
      const newUser: User = {
          username: rawValue.username,
          email: rawValue.email,
          fullName: rawValue.fullName,
          password: rawValue.password,
          // Campos opcionales (aseguramos string vacío si son null)
          DNI: rawValue.DNI || '',
          phoneNumber: rawValue.phoneNumber || '',
          address: rawValue.address || '',
          nationality: rawValue.nationality || '',
          // Aseguramos que isSeller sea booleano
          isSeller: !!rawValue.isSeller 
      };
        this.service.postUser(newUser).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Usuario registrado con éxito' });
          this.router.navigateByUrl("/sign-in");
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Cancelado', detail: 'No se realizaron cambios' });
      }
    });
  }

/* 
    if(this.formSignUp.invalid){
      this.visible.set(true);
      return
      
    }else{
      const user = this.formSignUp.getRawValue();
      if(confirm("Desea crear usuario? ")){
        this.service.postUser(user).subscribe(() => {
          alert("Usuario creado con exito");
          this.router.navigateByUrl("/sign-in");
        })
      }else{
        this.visible.set(true);
      }
    }
  }
*/
}
