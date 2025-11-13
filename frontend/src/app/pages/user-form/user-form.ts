import { Component, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../model/user';
import { UserService } from '../../service/user-service';

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

  protected readonly form = this.formBuilder.nonNullable.group({
    username: ["", [Validators.required]],
    email: ["", [Validators.required]],
    password: ["", [Validators.required]],
    repassword: ["", [Validators.required]],
    fullName: ["", [Validators.required]],
    DNI: ["", [Validators.required]],
    phoneNumber: ["", [Validators.required]],
    address: ["", [Validators.required]],
    nationality: ["", [Validators.required]]
  });


  handleSubmit(){
    if(this.form.invalid){
      alert("formulario invalido");
      return
    }
    else{
      const user = this.form.getRawValue();
      this.service.postUser(user)
    }
  }
}
