import { Component, input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { Province, PROVINCE_LABELS, PROVINCES } from '../../../model/address';
import { addressAllOrNothingValidator } from '../../../validator/addressAllOrNothingValidator';

@Component({
  selector: 'app-address-form',
  imports: [ReactiveFormsModule, FloatLabelModule, InputTextModule, SelectModule, MessageModule, CheckboxModule],
  templateUrl: './address-form.html',
  styleUrl: './address-form.css',
})
export class AddressForm {
  readonly addressGroup = input.required<FormGroup>();
  protected readonly provinceOptions = PROVINCES.map((p) => ({
    label: PROVINCE_LABELS[p],
    value: p,
  }));

  protected error(name: string): string | null {
    const control = this.addressGroup().get(name);
    if (!control || !control.touched || !control.errors) {
      return null;
    }
    if (control.errors['required'])  return 'Este campo es obligatorio';
    if (control.errors['pattern'])   return 'El formato no es válido';
    if (control.errors['maxlength']) return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
    return 'Valor inválido';
  }
}

export function buildAddressGroup(fb: FormBuilder) {
  return fb.nonNullable.group({
    street:     ['', [Validators.maxLength(100)]],
    streetNumber: ['', [Validators.maxLength(20)]],
    floor:      ['', [Validators.maxLength(10)]],
    apartment:  ['', [Validators.maxLength(10)]],
    crossStreetOne: ['', [Validators.maxLength(100)]],
    crossStreetTwo: ['', [Validators.maxLength(100)]],
    city:       ['', [Validators.maxLength(100)]],
    province:   ['' as Province, []],
    postalCode: ['', [Validators.maxLength(20),
                      Validators.pattern(/^\d{4}$|^[A-Z]\d{4}[A-Z]{3}$/)]],
    additionalInformation: ['', [Validators.maxLength(255)]],
  }, {validators: [addressAllOrNothingValidator]});
};

