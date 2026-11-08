import { Province } from '../../model/address';

export interface AddressRequest {
  street: string;
  city: string;
  province: Province;
  postalCode: string;
  streetNumber?: string;
  floor?: string;
  apartment?: string;
  crossStreetOne?: string;
  crossStreetTwo?: string;
  additionalInformation?: string;
}