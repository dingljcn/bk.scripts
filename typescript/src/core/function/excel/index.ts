window.$excel = {} as any;

window.$excel.export = function(name, data) {
    if (!window.isEnableExcel) {
        window.enableExcel();
    }
    let sheet = window.XLSX.utils.aoa_to_sheet(data);
    let blob = sheet2blob(sheet);
    openDownloadDialog(blob, name);
}

function string2ArrayBuffer(data: string): ArrayBuffer {
    var buf = new ArrayBuffer(data.length);
    var view = new Uint8Array(buf);
    for (let i = 0; i != data.length; i++) {
        view[i] = data.charCodeAt(i) & 0xFF;
    }
    return buf;
}

function sheet2blob(sheet: any, sheetName?: string): Blob {
	sheetName = sheetName || 'sheet1';
	let workbook: WorkBook = {
		SheetNames: [sheetName],
		Sheets: {}
	};
	$set(workbook.Sheets, sheetName, sheet);
	let data = window.XLSX.write(workbook,  {
		bookType: 'xlsx', // 要生成的文件类型
		bookSST: false,
		type: 'binary'
	});
	return new Blob([string2ArrayBuffer(data)], {type: "application/octet-stream"});
}

function openDownloadDialog(target: Blob, saveName: string) {
    let url: any = target;
	if (typeof url == 'object' && url instanceof Blob) {
		url = URL.createObjectURL(url); // 创建blob地址
	}
	var aLink = document.createElement('a');
	aLink.href = url;
	aLink.download = saveName || '';
    aLink.click();
}
