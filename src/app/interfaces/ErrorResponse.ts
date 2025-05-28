import { DefaultResponse } from './DefaultResponse';

export interface ErrorResponse extends DefaultResponse<null> {
    errors: any;
}