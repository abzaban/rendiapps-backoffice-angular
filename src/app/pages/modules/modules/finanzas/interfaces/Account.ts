import { Balance } from "./Balance";

export interface Account {
    id: string;
    bankName: string;
    accountNumber: string;
    created_at: string;
    balances: Balance[];
}