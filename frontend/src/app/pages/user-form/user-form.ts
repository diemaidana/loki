import { Component, inject, Input, signal } from '@angular/core';
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
import { InputText } from "primeng/inputtext";
import { ConfirmationService, MessageService } from 'primeng/api';
import { Toast } from "primeng/toast";
import { ConfirmDialog } from "primeng/confirmdialog";
import { CheckboxModule } from 'primeng/checkbox';
import { AddressForm, buildAddressGroup } from '../address-form/address-form/address-form';
import { SocialNumberType } from '../../model/account';
import { HttpErrorResponse } from '@angular/common/http';
import { documentLengthValidator } from '../../validator/document-length';
import { RegisterRequest } from '../../auth/dto/register-request';
import { AuthService } from '../../auth/service/auth-service';
import { httpErrorMessage } from '../../core/errors/http-message';
import { SelectModule } from 'primeng/select';

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
    InputText,
    Toast,
    ConfirmDialog,
    CheckboxModule,
    AddressForm,
    SelectModule
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
  private readonly auth = inject(AuthService);

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

  protected readonly addressGroup = buildAddressGroup(this.formBuilder);

  protected readonly documentTypes = [
    { label: 'DNI', value: 'DNI' as SocialNumberType },
    { label: 'CUIL', value: 'CUIL' as SocialNumberType },
    { label: 'CUIT', value: 'CUIT' as SocialNumberType },
  ];


  get email() {
    return this.formSignUp.controls.email;
  }

  get password() {
    return this.formSignUp.controls.password;
  }

  get repassword() {
    return this.formSignUp.controls.repassword;
  }

  get firstName() {
    return this.formSignUp.controls.firstName;
  }

  get lastName() {
    return this.formSignUp.controls.lastName;
  }

  get documentType() {
    return this.formSignUp.controls.documentType;
  }

  get documentNumber() {
    return this.formSignUp.controls.documentNumber;
  }

  get phoneNumber() {
    return this.formSignUp.controls.phoneNumber;
  }

  get address() {
    return this.formSignUp.controls.address;
  }

  get touched(){
    return this.formSignUp.touched;
  }

  protected get documentLengthError(): number | null {
    const error = this.formSignUp.getError('documentLength');
    return error ? error.expected : null;
  }


  protected readonly formSignUp = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName:  ['', [Validators.required, Validators.maxLength(50)]],
    email:     ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    password:  ['', [Validators.required, Validators.minLength(8), Validators.maxLength(64),
                    Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/)]],
    repassword: ['', [Validators.required]],
    documentType:   ['' as SocialNumberType, [Validators.required]],
    documentNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    phoneNumber: ['', [Validators.maxLength(20),
                      Validators.pattern(/^$|^\+?[0-9 \-]{6,20}$/)]],
    address: this.addressGroup,
  }, { validators: [passwordsMatchValidator, documentLengthValidator] });

  get formControls(){
    return this.formSignUp.controls
  }

  navigateTo(){
    return this.router.navigateByUrl("/");
  }

  handleSubmit() {
  if (this.formSignUp.invalid) {
    this.formSignUp.markAllAsTouched();
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Formulario inválido' });
    return;
  }

  this.confirmationService.confirm({
    header: 'Confirmar Registro',
    message: '¿Estás seguro de que deseas registrarte?',
    icon: 'pi pi-exclamation-triangle',

    accept: () => {
      const raw = this.formSignUp.getRawValue();
      const hasAddress = raw.address && Object.values(raw.address).some(value => value !== null && value !== '');
      
      const request: RegisterRequest = {
        firstName: raw.firstName,
        lastName: raw.lastName,
        email: raw.email.trim(),
        password: raw.password,
        documentType: raw.documentType,
        documentNumber: raw.documentNumber,
        phoneNumber: raw.phoneNumber || undefined,
        address: hasAddress ? {
          street: raw.address.street,
          city: raw.address.city,
          province: raw.address.province,
          postalCode: raw.address.postalCode,
          streetNumber: raw.address.streetNumber || undefined,
          floor: raw.address.floor || undefined,
          apartment: raw.address.apartment || undefined,
          crossStreetOne: raw.address.crossStreetOne || undefined,
          crossStreetTwo: raw.address.crossStreetTwo || undefined,
          additionalInformation: raw.address.additionalInformation || undefined,
        } : undefined,
      };

      this.auth.register(request).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Listo',
            detail: 'Si el email no estaba registrado, te enviamos un correo de verificación.',
          });
          this.router.navigateByUrl('/sign-in');
        },
        error: (err: HttpErrorResponse) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: httpErrorMessage(err),
          });
        },
      });
    },

    reject: () => {
      this.messageService.add({ severity: 'info', summary: 'Cancelado', detail: 'No se realizaron cambios' });
    },
  });
  }

      /* 
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
    }); */
  
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