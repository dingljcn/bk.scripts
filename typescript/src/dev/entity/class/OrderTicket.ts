import { Ticket } from "./Ticket";

export class OrderTicket {
    groupRegExp: RegExp;
    tabRegExp: RegExp;
    fieldKey: TicketFields;
    expectValue: Array<any>;
    func: Function;
    exec(groupName: string, tabName: string, ticket1: Ticket, ticket2: Ticket) {
        if (this.groupRegExp.test(groupName) && this.tabRegExp.test(tabName)) {
            if (this.func) {
                return this.func(groupName, tabName, ticket1, ticket2);
            } else {
                return this.expectValue.compareBy(ticket1.get(this.fieldKey), ticket2.get(this.fieldKey));
            }
        }
    }
}

window.defunc('OrderTicket', (groupRegExp: RegExp, tabRegExp: RegExp, fieldKey: TicketFields, expectValue: any) => {
    let result = new OrderTicket();
    result.groupRegExp = groupRegExp;
    result.tabRegExp = tabRegExp;
    result.fieldKey = fieldKey;
    if (Array.isArray(expectValue)) {
        result.expectValue = expectValue;
    } else {
        result.expectValue = [ expectValue ];
    }
    return result;
});

window.defunc('OrderTicket', (groupRegExp: RegExp, tabRegExp: RegExp, func: Function) => {
    let result = new OrderTicket();
    result.groupRegExp = groupRegExp;
    result.tabRegExp = tabRegExp;
    result.func = func;
    return result;
});