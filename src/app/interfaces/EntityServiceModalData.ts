import { ServiceModalData } from "./ServiceModalData";

export interface EntityServiceModalData<T, Y> extends ServiceModalData<T> {
    entity: Y;
}