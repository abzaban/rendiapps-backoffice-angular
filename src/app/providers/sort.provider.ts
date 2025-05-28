import { Injectable } from '@angular/core';

import { CustomSortTableAction } from '../interfaces/CustomSortTableAction';

@Injectable({
    providedIn: 'root',
})
export class SortProvider {
    constructor() { }

    sort(sortTableAction: CustomSortTableAction, data: any[]) {
        let sortedData: any[] = [...data];

        if (sortTableAction.direction != '') {

            if (!sortTableAction.isDate)
                sortedData = sortedData.sort((a: any, b: any) => {
                    let aValue: string = a[sortTableAction.active] ? a[sortTableAction.active] : '0';
                    let bValue: string = b[sortTableAction.active] ? b[sortTableAction.active] : '0';

                    if (aValue < bValue)
                        return -1;

                    if (aValue > bValue)
                        return 1;

                    return 0;
                });
            else
                sortedData.sort((a: any, b: any) => {
                    let dateSplitedA: string[] = (<string>a[sortTableAction.active]).split('/');
                    let dateFormatedA: string = `${dateSplitedA[1]}/${dateSplitedA[0]}/${dateSplitedA[2]}`;
                    let dateSplitedB: string[] = (<string>b[sortTableAction.active]).split('/');
                    let dateFormatedB: string = `${dateSplitedB[1]}/${dateSplitedB[0]}/${dateSplitedB[2]}`;

                    let numberDateA: number = new Date(dateFormatedA).getTime();
                    let numberDateB: number = new Date(dateFormatedB).getTime();

                    return numberDateA - numberDateB;
                });

            if (sortTableAction.direction == 'desc')
                sortedData.reverse();
        }

        return sortedData;
    }
}
