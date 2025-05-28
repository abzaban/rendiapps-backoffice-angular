import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class FormatProvider {
    constructor() { }

    dateObjToMDYString(date: Date): string {
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }

    getTodayDateFormattedForFileName(): string {
        let dateName: string = '';
        new Date().toString().replace(/\s/g, '_').split('_').forEach((resp: string, index: number) => {
            if (index == 1 || index == 2 || index == 3 || index == 4)
                dateName += `_${resp}`;
        });
        return dateName;
    }

    convertFileToBase64(file: File): Promise<any> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }
}
