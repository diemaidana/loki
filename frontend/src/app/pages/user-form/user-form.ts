import { Component, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../model/user';
import { UserService } from '../../service/user-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm {
  private readonly formBuilder = inject(FormBuilder);
  private readonly service = inject(UserService);
  protected readonly user = input<User>();
  private readonly router = inject(Router);

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

  protected readonly formSingUp = this.formBuilder.nonNullable.group({
    username: ["", [Validators.required]],
    email: ["", [Validators.required]],
    password: ["", [Validators.required]],
    repassword: ["", [Validators.required]],
    fullName: ["", [Validators.required]],
    DNI: ["", [Validators.required]],
    phoneNumber: [""],
    address: ["", [Validators.required]],
    nationality: ["", [Validators.required]]
  });

  navigateTo(){
    this.router.navigateByUrl("/");
  }

  handleSubmit(){
    if(this.formSingUp.invalid){
      alert("formulario invalido");
      return
    }
    else{
      const user = this.formSingUp.getRawValue();
      this.service.postUser(user);
    }
  }
}
