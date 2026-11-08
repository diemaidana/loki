import { Address } from './address';

export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export type SocialNumberType = 'DNI' | 'CUIL' | 'CUIT';

export interface Account {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  documentType: SocialNumberType;
  documentNumber: string;
  address: Address | null;
  status: AccountStatus;
  emailVerified: boolean;
  createdAt: string;
  isSeller?: false;
}
