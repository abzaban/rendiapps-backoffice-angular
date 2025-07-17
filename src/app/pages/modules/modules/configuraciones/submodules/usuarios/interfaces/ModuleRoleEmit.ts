import { CustomEmit } from '../../../../../../../shared/filter-input/interfaces/interfaces';

export interface ModuleRoleEmit extends CustomEmit {
    roleName: string;
    roleId: number;
}