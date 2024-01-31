import { Ticket } from "./Ticket";

export class TabStrategy {
    groupRegExp: RegExp;
    fieldKey: string;
    expectValue: Array<any>;
    tabName: string;
    reverse: boolean;
    func: Function;
    /** 返回 tab 页名称 */
    exec(groupName: string, ticket: Ticket) {
        let isMatch = this.groupRegExp.test(groupName);
        if (this.reverse) {
            isMatch = !isMatch;
        }
        if (isMatch) {
            if (this.func) {
                return this.func(groupName, ticket);
            } else if (this.expectValue.includesIgnoreCase(ticket.get(this.fieldKey as any))) {
                return this.tabName;
            }
        }
        return '';
    }
}

window.defunc('TabPageStrategy', (groupRegExp: RegExp, fieldKey: string, expectValue: any, tabName: string) => {
    return (window as any).TabPageStrategy(groupRegExp, fieldKey, expectValue, tabName, false);
});

window.defunc('TabPageStrategy', (groupRegExp: RegExp, fieldKey: string, expectValue: any, tabName: string, reverse: boolean) => {
    const result = new TabStrategy();
    result.groupRegExp = groupRegExp;
    result.fieldKey = fieldKey;
    result.tabName = tabName;
    result.reverse = reverse;
    if (Array.isArray(expectValue)) {
        result.expectValue = expectValue;
    } else {
        result.expectValue = [ expectValue ];
    }
    return result;
});

window.defunc('TabPageStrategy', (groupRegExp: RegExp, func: Function) => {
    return (window as any).TabPageStrategy(groupRegExp, func, false);
});

window.defunc('TabPageStrategy', (groupRegExp: RegExp, func: Function, reverse: boolean) => {
    const result = new TabStrategy();
    result.groupRegExp = groupRegExp;
    result.func = func;
    result.reverse = reverse;
    return result;
});