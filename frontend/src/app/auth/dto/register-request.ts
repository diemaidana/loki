import { SocialNumberType } from '../../model/account';
import { AddressRequest } from './address-request';

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  documentType: SocialNumberType;
  documentNumber: string;
  phoneNumber?: string;
  address?: AddressRequest;
}