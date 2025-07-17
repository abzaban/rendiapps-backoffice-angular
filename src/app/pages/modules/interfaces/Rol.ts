import { Submodule } from './Submodule';

export interface Rol {
    id: number;
    name: string;
    subModules: Submodule[];
}