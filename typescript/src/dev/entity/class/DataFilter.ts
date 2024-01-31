import { Ticket } from "./Ticket";

export class DataFilter {
    groupRegExp: RegExp;
    tabRegExp: RegExp;
    ignoreColumns: Array<string>;
    func: Function;
    isRow: boolean;
    type: 'single' | 'array' | 'function';
    /** 返回 true 表示是要过滤掉的 */
    exec(groupName: string, tabName: string, list: Array<Ticket>, ticket: Ticket, columnKey = '') {
        if (this.groupRegExp.test(groupName) && this.tabRegExp.test(tabName)) {
            if (this.func) {
                if (this.isRow) {
                    return this.func(groupName, tabName, ticket); // 行过滤不要考虑 columnKey
                } else {
                    return this.func(groupName, tabName, list, columnKey); // 列过滤要考虑 columnKey
                }
            } else {
                if (!this.isRow) {
                    return this.ignoreColumns.includesIgnoreCase(columnKey); // 包含就返回 true, 表示要过滤掉
                }
            }
        }
        return false;
    }
}

/** 行过滤器, 由于还不够精细, 无法提供列过滤器那种数组形式的过滤方式, 只支持传入一个回调函数, 回调函数有三个参数: (groupName, tabName, ticket) */
window.defunc('RowFilter', (groupRegExp: RegExp, tabRegExp: RegExp, func: Function) => {
    let result = new DataFilter();
    result.isRow = true;
    result.groupRegExp = groupRegExp;
    result.tabRegExp = tabRegExp;
    result.func = func;
    return result;
});

window.defunc('ColFilter', (groupRegExp: RegExp, tabRegExp: RegExp, arg: string | Array<string> | Function) => {
    let result = new DataFilter();
    result.isRow = false;
    result.groupRegExp = groupRegExp;
    result.tabRegExp = tabRegExp;
    if (Array.isArray(arg)) {
        result.ignoreColumns = arg;
        result.type = 'array'
    } else if (typeof arg == 'function') {
        result.func = arg;
        result.type = 'function'
    } else {
        result.ignoreColumns = [ arg ];
        result.type = 'single';
    }
    return result;
});