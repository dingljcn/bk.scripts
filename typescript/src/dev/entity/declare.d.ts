import { DataFilter } from "./class/DataFilter";
import { GroupStrategy } from "./class/GroupStrategy";
import { OrderTicket } from "./class/OrderTicket";
import { TabStrategy } from "./class/TabStrategy";

declare global {
    interface Window {
        GroupStrategy(fieldKey: string, expectValue: any, groupName: string): GroupStrategy;
        GroupStrategy(func: Function): GroupStrategy;
        RowFilter(groupRegExp: RegExp, tabRegExp: RegExp, func: Function): DataFilter;
        ColFilter(groupRegExp: RegExp, tabRegExp: RegExp, arg: string | Array<string> | Function): DataFilter;
        OrderTicket(groupRegExp: RegExp, tabRegExp: RegExp, fieldKey: string, expectValue: any): OrderTicket;
        OrderTicket(groupRegExp: RegExp, tabRegExp: RegExp, func: Function): OrderTicket;
        TabPageStrategy(groupRegExp: RegExp, fieldKey: string, expectValue: any, tabName: string): TabStrategy;
        TabPageStrategy(groupRegExp: RegExp, fieldKey: string, expectValue: any, tabName: string, reverse: boolean): TabStrategy;
        TabPageStrategy(groupRegExp: RegExp, func: Function): TabStrategy;
        TabPageStrategy(groupRegExp: RegExp, func: Function, reverse: boolean): TabStrategy;
    }
}

export {};