import { Injectable } from '@angular/core';

import * as fs from 'file-saver';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { Workbook } from 'exceljs';

import { FormatProvider } from './format.provider';

@Injectable({
    providedIn: 'root',
})
export class DownloadProvider {
    constructor(private _formatProvider: FormatProvider) { }

    downloadPdf(title: string, headers: string[], data: any[]) {
        const pdf = new jsPDF({ unit: 'pt' });
        autoTable(pdf, {
            head: [headers],
            body: data,
            headStyles: { fontSize: 10 },
            bodyStyles: { fontSize: 8 },
        });

        pdf.save(`${title.replace(/\s/g, '_').trim().toLowerCase()}${this._formatProvider.getTodayDateFormattedForFileName()}.pdf`);
    }

    downloadExcel(title: string, headers: string[], data: any[]) {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet(title);

        const titleRow = worksheet.addRow([title]);
        worksheet.mergeCells('A1:H1');
        titleRow.font = {
            name: 'arial',
            family: 4,
            size: 14,
            underline: 'double',
            bold: true,
        };
        worksheet.addRow([]);

        const headerRow = worksheet.addRow(headers);
        headerRow.eachCell((cell, number) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFFF00' },
                bgColor: { argb: 'FF0000FF' },
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        });

        let columns = 0;
        let values: string[] = [];
        data.forEach((obj) => {
            let row: string[] = [];
            values = Object.values(obj);
            values.forEach((element: string) => {
                row.push(element);
            });

            worksheet.addRow(row);
        });

        columns = values.length;
        for (let i = 1; i < columns + 1; i++) {
            worksheet.getColumn(i).width = 25;
            worksheet.getColumn(i).alignment = { vertical: 'middle', horizontal: 'center' };
        }

        workbook.xlsx.writeBuffer().then((data: any) => {
            const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, `${title.replace(/\s/g, '_').trim().toLowerCase()}${this._formatProvider.getTodayDateFormattedForFileName()}.xlsx`);
        });
    }
}
