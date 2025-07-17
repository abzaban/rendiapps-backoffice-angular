import { User } from '../pages/modules/modules/configuraciones/submodules/usuarios/interfaces/User';

import { DefaultResponse } from './DefaultResponse';

export interface AuthResponse extends DefaultResponse<User> {
    ra_token: string;
}