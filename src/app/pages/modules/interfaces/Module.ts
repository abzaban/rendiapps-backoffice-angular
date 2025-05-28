import { Rol } from './Rol';
export interface Module {
    id: string;
    name: string;
    description: string;
    uri: string;
    image: string;
    isMaintenance: boolean;
    roles: Rol[];
}
