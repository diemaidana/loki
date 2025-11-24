import { Component, inject, Input, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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

@Component({
  selector: 'app-user-form',
  imports: [
    ReactiveFormsModule,
    CardModule,
    FloatLabelModule,
    MessageModule,
    PasswordModule,
    ButtonModule,
    Dialog,
    InputText
],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm {
  private readonly formBuilder = inject(FormBuilder);
  private readonly service = inject(UserService);
  @Input() protected readonly user?:User;
  private readonly router = inject(Router);

  protected visible: boolean = false;

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
    nationality: ["", [Validators.required]]
  }, { validators: [passwordsMatchValidator]});

  get formControls(){
    return this.formSignUp.controls
  }

  navigateTo(){
    return this.router.navigateByUrl("/");
  }

  handleSubmit(){
    if(this.formSignUp.invalid){
      this.visible = true;
      return
      
    }else{
      const user = this.formSignUp.getRawValue();
      if(confirm("Desea crear usuario? ")){
        this.service.postUser(user).subscribe(() => {
          alert("Usuario creado con exito");
          this.router.navigateByUrl("/sign-in");
        })
      }else{
        this.visible = true;
      }
    }
  }

}
