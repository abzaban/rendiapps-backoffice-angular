import { Account } from "./Account";

export interface Wallet {
    id: string;
    accounts: Account[];
}