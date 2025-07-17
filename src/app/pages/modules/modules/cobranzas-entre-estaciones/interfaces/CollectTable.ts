import { Payment } from "./Payment";

export interface CollectTable {
    id: string;
    stationCollectNickName: string;
    stationPayNickName: string;
    status: string;
    amount: number;
    amountRemaining: number;
    file: string;
    debitDate: string;
    created_at: string;
    payments: Payment[];
}