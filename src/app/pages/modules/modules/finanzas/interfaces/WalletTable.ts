import { Account } from "./Account";

export interface WalletTable {
    id: string;
    ownerNickName: string;
    accounts: Account[];
}