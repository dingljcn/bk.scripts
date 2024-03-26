import { LangItem } from "core";

const fields = {
    caseName: '用例名称',
    status: '状态',
    component: '模块',
    ticket: '变更号',
    currentRow: '当前行数',
    totalRow: '总行数',
    dbType: '数据库类型',
    currentStep: '当前结束的步骤',
    totalStep: '总步骤',
    percent: '进度',
    zip: '打包版本',
    level: '等级',
    casePath: '用例路径',
    timeCost: '耗费时间',
}

export class Case {
    caseName: string; 
    status: LangItem; 
    component: string; 
    ticket: string; 
    currentRow: number; 
    totalRow: number; 
    dbType: string;
    currentStep: number; 
    totalStep: number; 
    percent: string; 
    zip: string; 
    level: number; 
    casePath: string; 
    timeCost: string;
    static _fieldMap_: any = fields;
    static _fields_ = Object.keys(fields);
    constructor(origin: any, statusConstant: any) {
        if (!origin) {
            return;
        }
        if (origin.stats) {
            if (origin.stats == '待发送') {
                this.status = statusConstant.NOTSEND;
            } else if (origin.stats == '结束') {
                if (origin.result == 'TICKET') {
                    this.status = statusConstant.TICKET;
                } else if (origin.result == 'SUCCESS') {
                    this.status = statusConstant.SUCCESS;
                } else if (origin.result == 'ERROR') {
                    this.status = statusConstant.ERROR
                } else {
                    this.status = statusConstant.UNKNOWN;
                    console.error(`未知的状态 {${ origin.stats }}, 结果 {${ origin.result }}, 请联系 dinglj 补充`);
                }
            } else if (origin.stats == '执行中') {
                this.status = statusConstant.RUNNING;
            } else if (origin.stats == '等待资源') {
                this.status = statusConstant.WAITTING;
            } else if (origin.stats == '失败') {
                this.status = statusConstant.FAILED;
            } else if (origin.stats == '已发送') {
                this.status = statusConstant.SENDED;
            } else {
                this.status = statusConstant.UNKNOWN;
                console.error(`未知的状态 {${ origin.stats }}, 请联系 dinglj 补充`);
            }
        } else {
            if (origin.result == 'TICKET') {
                this.status = statusConstant.TICKET;
            } else if (origin.result == 'SUCCESS') {
                this.status = statusConstant.SUCCESS;
            } else {
                this.status = statusConstant.UNKNOWN;
                console.error(`未知的结果 {${ origin.result }}, 请联系 dinglj 补充`);
            }
        }
        if (this.status == statusConstant.UNKNOWN) { // 没有状态, 打印原始数据
            console.error(origin);
        }
        this.currentRow = parseInt(origin.currentRow || 0);
        this.zip = origin.erpVersion;
        this.level = origin.level || origin.clevel;
        this.component = origin.module;
        this.caseName = origin.testcaseName || origin.testCaseName;
        this.casePath = origin.testcasePath;
        this.totalRow = parseInt(origin.totalRow || 0);
        this.currentStep = parseInt(origin.endStepNum || 0);
        this.totalStep = parseInt(origin.totalStepNum || 0);
        this.timeCost = origin.timeCost;
        let ticket = origin.ticketId || origin.log;
        this.ticket = ticket ? parseInt(ticket) : ticket;
        this.dbType = origin.dbType || '';
        if (this.totalStep) {
            this.percent = (this.currentStep / this.totalStep * 100).toFixed(2) + '%';
        }
    }
    static getCaption(field: string) {
        switch(field) {
            case 'caseName': return '用例名称';
            case 'status': return '状态';
            case 'component': return '模块';
            case 'ticket': return '变更号';
            case 'currentRow': return '当前行数';
            case 'totalRow': return '总行数';
            case 'currentStep': return '当前结束的步骤';
            case 'totalStep': return '总步骤';
            case 'zip': return '打包版本';
            case 'level': return '等级';
            case 'casePath': return '用例路径';
            case 'timeCost': return '耗费时间';
            case 'percent': return '进度';
        }
    }
}
