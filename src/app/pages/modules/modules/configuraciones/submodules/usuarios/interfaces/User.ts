import { UserPermission } from './UserPermission';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    address: string;
    email: string;
    image: string;
    username: string;
    permissions: UserPermission;
}