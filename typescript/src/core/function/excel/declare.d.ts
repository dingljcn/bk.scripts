declare global {
    interface ExcelOptions {
        bookType: 'xls' | 'xlsx';
        bookSST: boolean;
        type: 'binary';
    }
    interface WorkBook {
        SheetNames: Array<string>;
        Sheets: any;
    }
    interface XLSX {
        utils: {
            aoa_to_sheet(data: Array<Array<any>>): any,
        },
        write(workbook: WorkBook, options: ExcelOptions): string;
    }
    interface DingljExcel {
        /** 导出 Excel 文件 */
        export(name: string, data: Array<Array<any>>): void;
    }
    /** Excel 工具类 */
    const $excel: DingljExcel;
    interface Window {
        /** Excel 工具类 */
        $excel: DingljExcel;
        /** 是否已经启用 */
        isEnableExcel: boolean;
        /** 启用 Excel 功能 */
        enableExcel(): void;
        /** Excel 对象 */
        XLSX: XLSX;
    }
}

export {};