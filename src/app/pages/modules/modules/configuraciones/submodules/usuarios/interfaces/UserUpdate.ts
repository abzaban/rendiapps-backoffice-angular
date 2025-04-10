import { UserPermission } from './UserPermission';

export interface UserUpdate {
    firstName: string;
    lastName: string;
    address: string;
    permissions: UserPermission;
}