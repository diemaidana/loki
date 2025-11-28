export interface User {
    id?: string | number,
    username: string;
    email: string;
    password: string;
    fullName: string;
    DNI: string;
    phoneNumber: string;
    address: string;
    nationality: string;
    isSeller: boolean;
}
