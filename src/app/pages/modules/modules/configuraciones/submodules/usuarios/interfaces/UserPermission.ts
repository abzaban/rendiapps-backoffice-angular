import { UserModulePermission } from './UserModulePermission';

export interface UserPermission {
    enterprises: string[];
    stations: string[];
    modules: UserModulePermission[]
}