const fields = {
    id: '变更号',
    summary: '概述',
    status: '状态',
    reporter: '报告人',
    owner: '属主',
    type: '类型',
    priority: '优先级',
    component: '组件',
    resolution: '处理结果',
    time: '创建时间',
    changetime: '修改时间',
    plandate: '计划日期',
    pingtai: '平台',
    project: '项目',
    ticketclass: '分类',
    testadjust: '测试调整',
    testreport: '测试调整提出者',
    testower1: '测试调整处理者',
    keywords: '关键词',
    cc: '抄送',
    version: '版本',
    needbuild: '需打包',
    devtype: '开发类型',
    dinglj_note: '备注',
};

export class Ticket {
    static fields = fields;
    static fieldNames: Array<TicketFields> = (Object.keys(fields) as any);
    static fieldValues = Object.values(fields);
    static unknownColumn = ['sel'];
    static getCaption(key: any) {
        if (Ticket.fieldNames.includesIgnoreCase(key)) {
            return (Ticket.fields as any)[key];
        }
        return key;
    }
    constructor(element: HTMLElement = null) {
        if (element == null) {
            return;
        }
        const info = $store.getStorage<any>('dinglj-v-ticket-cache', {});
        for (let cell of element.children) {
            const key = cell.className;
            const value = cell.innerText.trim();
            this.set(key as any, value);
            if ('id'.equalsIgnoreCase(key) && info[value]) {
                const cacheFields: Array<TicketFields> = Object.keys(info[value]) as any;
                for (let field of cacheFields) {
                    this.set(field, info[value][field]);
                }
            }
        }
    }
    static forLocalTest(element: any) {
        let ticket = new Ticket();
        const info = $store.getStorage<any>('dinglj-v-ticket-cache', {});
        for (let key of Object.keys(element)) {
            const value = $get<any>(element, key);
            ticket.set(key as any, value);
            if ('id'.equalsIgnoreCase(key) && info[value]) {
                const cacheFields: Array<TicketFields> = Object.keys(info[value]) as any;
                for (let field of cacheFields) {
                    ticket.set(field, info[value][field]);
                }
            }
        }
        return ticket;
    }
    set(key: TicketFields, value: any) {
        if (Ticket.fieldNames.includesIgnoreCase(key)) {
            (this as any)[key] = value;
        } else if (!Ticket.unknownColumn.includesIgnoreCase(key)) {
            `不存在的列: ${ key }`.warn();
            Ticket.unknownColumn.push(key);
        }
    }
    get(key: TicketFields): any {
        if ($get(this, key)) {
            return $get(this, key);
        }
        return '';
    }
}