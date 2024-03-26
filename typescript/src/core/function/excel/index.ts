window.$excel = {} as any;

window.$excel.export = function(name, data) {
    if (!window.isEnableExcel) {
        window.enableExcel();
    }
    let sheet = window.XLSX.utils.aoa_to_sheet(data);
    let blob = sheet2blob(sheet);
    openDownloadDialog(blob, name);
}

window.$excel.readFile = function(file: File, options?: ExcelOptions) {
    if (!window.isEnableExcel) {
        window.enableExcel();
    }
	return window.XLSX.readFile(file, options);
}

window.$excel.read = function(file, callback) {
    if (!window.isEnableExcel) {
        window.enableExcel();
    }
	const reader = new FileReader();
	reader.onload = function(e: any) {
		var data = e.target.result;
		var workbook = window.XLSX.read(data, {
			type: 'binary'
		});
		for (let i = 0; i < workbook.SheetNames.length; i++) {
			const sheetName = workbook.SheetNames[i];
			if (!workbook.Sheets[sheetName]['!ref']) {
				workbook.SheetNames.splice(i, 1);
			}
		}
		if (callback) {
			callback(workbook);
		}
	}
	reader.readAsBinaryString(file);
	return null;
}

function fixdata(data: any): any {
	let result = '';
	const w = 10240;
	for (let i = 0; i < data.byteLength / w; i++) {
		result += String.fromCharCode.apply(null, new Uint8Array(data.splice(i * w, i * w + w)));
		result += String.fromCharCode.apply(null, new Uint8Array(data.splice(i * w)));
	}
	return result;
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

window.$excel.resolveSheets = function(workBook) {
	for (let sheetName of workBook.SheetNames) {
		window.$excel.resolveSheet(workBook, sheetName);
	}
	return null;
}

window.$excel.resolveSheet = function(workBook, sheetName) {
	const ref = workBook.Sheets[sheetName]['!ref'];
	if (!ref) {
		return [[]];
	}
	const result = [];
	const [ from, to ]: string = ref.split(':');
	const fromRow = /(\d+)/.exec(from)[1];
	const fromCol = from.replace(fromRow, '');
	const toRow = /(\d+)/.exec(to)[1];
	const toCol = to.replace(toRow, '');
	const fromRowNum = parseInt(fromRow);
	const toRowNum = parseInt(toRow);
	const fromColNum = toNum(fromCol);
	const toColNum = toNum(toCol);
	for (let i = fromRowNum; i <= toRowNum; i++) {
		let row = [];
		for (let j = fromColNum; j <= toColNum; j++) {
			const col = toColumn(j);
			const key = col + i;
			row.push(workBook.Sheets[sheetName][key]);
		}
		if (row.length > 0) {
			result.push(row);
		}
	}
	window.pushToArray(workBook, 'array', {
		sheetName: sheetName,
		value: result,
	})
	return result;
}

function toNum(val: string) {
    val = val.toLowerCase();
    let sum = 0;
    for (let i = 0; i < val.length; i++) {
        let charNum = val.charCodeAt(i) - 96;
        sum += charNum * Math.pow(26, val.length - i - 1);
    }
    return sum;
}

function toColumn(num: number) {
    num -= 1;
	let offset = 26;
	const getCode = (n: number) => String.fromCharCode('A'.charCodeAt(0) + n);
	const digits = 26;
	let length = 1;
	while (num >= offset) {
		num = num - offset;
		offset = offset * 26;
		length++;
	}
	let str = getCode(num % digits);
	while (num >= digits) {
		num = Math.floor(num / digits);
		str = getCode(num % digits) + str;
	}
	str = 'A'.repeat(length - str.length) + str;
	return str;
};