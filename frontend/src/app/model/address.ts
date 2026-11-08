export const PROVINCES = [
  'BUENOS_AIRES', 'CABA', 'CATAMARCA', 'CHACO', 'CHUBUT', 'CORDOBA',
  'CORRIENTES', 'ENTRE_RIOS', 'FORMOSA', 'JUJUY', 'LA_PAMPA', 'LA_RIOJA',
  'MENDOZA', 'MISIONES', 'NEUQUEN', 'RIO_NEGRO', 'SALTA', 'SAN_JUAN',
  'SAN_LUIS', 'SANTA_CRUZ', 'SANTA_FE', 'SANTIAGO_DEL_ESTERO',
  'TIERRA_DEL_FUEGO', 'TUCUMAN',
] as const;

export type Province = typeof PROVINCES[number];

export const PROVINCE_LABELS: Record<Province, string> = {
  BUENOS_AIRES: 'Buenos Aires',
  CABA: 'CABA',
  CATAMARCA: 'Catamarca',
  CHACO: 'Chaco',
  CHUBUT: 'Chubut',
  CORDOBA: 'Córdoba',
  CORRIENTES: 'Corrientes',
  ENTRE_RIOS: 'Entre Ríos',
  FORMOSA: 'Formosa',
  JUJUY: 'Jujuy',
  LA_PAMPA: 'La Pampa',
  LA_RIOJA: 'La Rioja',
  MENDOZA: 'Mendoza',
  MISIONES: 'Misiones',
  NEUQUEN: 'Neuquén',
  RIO_NEGRO: 'Río Negro',
  SALTA: 'Salta',
  SAN_JUAN: 'San Juan',
  SAN_LUIS: 'San Luis',
  SANTA_CRUZ: 'Santa Cruz',
  SANTA_FE: 'Santa Fe',
  SANTIAGO_DEL_ESTERO: 'Santiago del Estero',
  TIERRA_DEL_FUEGO: 'Tierra del Fuego',
  TUCUMAN: 'Tucumán',
};

export interface Address {
    street: string;
    city: string;
    province: Province;
    postalCode: string;

    streetNumber: string | null;
    floor: string | null;
    apartment: string | null;
    crossStreetOne: string | null;
    crossStreetTwo: string | null;
    additionalInformation: string | null;
}
