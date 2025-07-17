export interface DefaultResponse<T> {
    error: boolean;
    msg: string;
    payload: T;
}