import { ServiceModalData } from "./ServiceModalData";

export interface EntityIdServiceModalData<T> extends ServiceModalData<T> {
    entityId: string;
}