import { UserPermission } from './UserPermission';

export interface UserAdd {
    firstName: string;
    lastName: string;
    address: string;
    email: string;
    username: string;
    password: string;
    permissions: UserPermission;
}