import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../environments/environment';

import { BaseService } from './base.service';

import { DepartmentTable } from '../pages/modules/modules/recursos-humanos/submodules/departamentos/interfaces/DepartmentTable';
import { DepartmentAdd } from '../pages/modules/modules/recursos-humanos/submodules/departamentos/interfaces/DepartmentAdd';
import { Department } from '../pages/modules/modules/recursos-humanos/submodules/departamentos/interfaces/Department';

import { DefaultResponse } from '../interfaces/DefaultResponse';

@Injectable({
    providedIn: 'root',
})
export class DepartmentService extends BaseService {
    private _departmentsUrl: string;

    constructor(private http: HttpClient) {
        super();
        this._departmentsUrl = `${environment.base_url}/departments`;
    }

    add(department: DepartmentAdd) {
        const body = {
            ra_token: this.token,
            name: department.name,
            ownerId: department.ownerId,
        };
        return this.http.post<DefaultResponse<null>>(this._departmentsUrl, body);
    }

    getAll() {
        const params = new HttpParams().set('ra_token', this.token);
        return this.http.get<DefaultResponse<Department[]>>(`${this._departmentsUrl}`, { params });
    }

    update(departmentId: string, department: DepartmentAdd) {
        const body = {
            ra_token: this.token,
            name: department.name,
            ownerId: department.ownerId,
        };
        return this.http.put<DefaultResponse<null>>(`${this._departmentsUrl}/${departmentId}`, body);
    }

    delete(departmentId: string) {
        const params = new HttpParams().set('ra_token', this.token);
        return this.http.delete<DefaultResponse<null>>(`${this._departmentsUrl}/${departmentId}`, { params });
    }

    getTableAdapter() {
        const params = new HttpParams().set('ra_token', this.token);
        return this.http.get<DefaultResponse<DepartmentTable[]>>(`${this._departmentsUrl}/getTableAdapter`, { params });
    }

    get(departmentId: string) {
        const params = new HttpParams().set('ra_token', this.token);
        return this.http.get<DefaultResponse<Department>>(`${this._departmentsUrl}/${departmentId}`, { params });
    }
}
