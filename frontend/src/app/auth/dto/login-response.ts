import { Account } from "../../model/account";

export interface LoginResponse {
    token: string;
    expiresAt: string;
    account: Account;
}
