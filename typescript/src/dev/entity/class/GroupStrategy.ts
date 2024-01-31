import { Ticket } from "./Ticket";

export class GroupStrategy {
    fieldKey: string;
    expectValue: Array<any>;
    groupName: string;
    func: Function;
    exec(ticket: Ticket, fieldKey: string) {
        if (this.func) {
            return this.func(ticket, fieldKey);
        } else if (this.fieldKey == fieldKey && this.expectValue.includesIgnoreCase(ticket.get(fieldKey as any))) {
            return this.groupName;
        }
        return '';
    }
}

window.defunc('GroupStrategy', (fieldKey: string, expectValue: any, groupName: string) => {
    let result = new GroupStrategy();
    result.fieldKey = fieldKey;
    result.expectValue = expectValue;
    result.groupName = groupName;
    if (Array.isArray(expectValue)) {
        result.expectValue = expectValue;
    } else {
        result.expectValue = [ expectValue ];
    }
    return result;
});

window.defunc('GroupStrategy', (func: Function) => {
    let result = new GroupStrategy();
    result.func = func;
    return result;
})