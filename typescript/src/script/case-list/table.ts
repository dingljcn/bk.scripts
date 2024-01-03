import { Compute, Method, Mounted, Prop, Template } from "../../component";
import { AbstractComponent, Case, EmitPara, LangItem, Registry } from "../../entity";

class TableMode extends AbstractComponent {

    @Mounted(TableMode, 'CL-Table')
    public mounted(): void {
        this.vid = window.uuid(this.name);
        this.emit('mounted', this.vid);
    }

    @Template
    public template: string = `<div class="mode-container table">
        <i-table v-for="statusName in statusNames" class="every-tab" @mounted="onTableMounted" 
                :columns="getColumnsToDisplay(statusName)"  
                :data="groupData[statusName]"
                :get-column-key="col => col.en"
                :get-column-caption="col => col.zh"
                :flex-columns="['caseName']">
        </i-table>
    </div>`;

    @Method
    public onTableMounted(para: EmitPara): void {
        const list = window.query(`#${ para.vid } .dinglj-v-tbody .dinglj-v-cell.ticket`);
        list.forEach((i: HTMLElement) => {
            const text = i.innerText.trim();
            if (text) {
                i.innerHTML = `<div onclick="window.open('${ window.getConfigOrDefault(this.config, this.defaultConfig, 'urls.ticket', '', false) }/${ text }', '#${ text }')">#${ text }</div>`;
            }
        })
    }

    /** 计算某模块, 某状态下有哪些列要显示 */
    @Method
    public getColumnsToDisplay(statusName: string): Array<LangItem> {
        if (!this.groupData || !this.groupData[statusName] || !this.groupData[statusName].length) {
            return [];
        }
        // 先把所有列计算出来
        let ignoreColumns = window.getConfigOrDefault(this.config, this.defaultConfig, 'table.ignoreColumn', [], false);
        const list4Display: Array<Case> = this.groupData[statusName];
        const result = Case._fields_.filter(fieldName => {
            // 根据配置把忽略的列过滤掉
            if (ignoreColumns.includesIgnoreCase(fieldName)) {
                return false;
            }
            // 然后看看有没有哪一列是完全没有数据的, 也过滤掉, 只要这列在任意行有数据, 都不会过滤掉
            for (let _case_ of list4Display) {
                if (_case_ && (_case_ as any)[fieldName]) {
                    return true;
                }
            }
            return false
        }).map(fieldName => new LangItem(fieldName, Case._fieldMap_[fieldName]));
        return result;
    }

    @Compute(function(): any {
        return window.readConfig();
    })
    public config: any;

    @Compute(function(): any {
        return window.defaultConfig();
    })
    public defaultConfig: any;

    @Prop(Object, {})
    public groupData: any;

    @Prop(Array, [])
    public statusNames: Array<string>;

}

export const table = Registry.getComponent('CL-Table').build();