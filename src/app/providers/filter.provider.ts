import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class FilterProvider {
    constructor() { }

    filterByOneAttribute(filter: string, attribute: string, data: any[]) {
        return data.filter((element: any) => element[attribute] == filter);
    }
}
