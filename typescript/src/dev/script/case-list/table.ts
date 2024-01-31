import { AbstractComponent, LangItem } from "core";
import { Case } from "dev";

@Service(TableMode, 'AppTable', true)
class TableMode extends AbstractComponent<AppTableProps> {

    @Template
    public template: string = `<div class="mode-container table">
        <i-table v-for="statusName in statusNames" class="every-tab" :i-props="tableProps(statusName)"></i-table>
    </div>`;

    @Method public tableProps(statusName: string): TableProps<Case, LangItem> {
        const self: TableMode = this;
        return {
            list: this.groupData[statusName],
            columns: this.getColumnsToDisplay(statusName),
            flexColumns: ['caseName'],
            getColumnKey: item => item.en,
            getColumnLabel: item => item.zh,
            getCell: (item, column) => {
                if (column instanceof LangItem) {
                    return $get(item, column.en);
                }
                return $get(item, column);
            },
            loaded: para => {
                const list = window.query(`#${ para.vid } .dinglj-v-tbody .dinglj-v-cell.ticket`);
                list.forEach((i: HTMLElement) => {
                    const text = i.innerText.trim();
                    if (text) {
                        i.innerHTML = `<div onclick="window.open('${ window.getConfigOrDefault(self.config, self.defaultConfig, 'urls.ticket', '', false) }/${ text }', '#${ text }')">#${ text }</div>`;
                    }
                })
            }
        }
    };

    /** 计算某模块, 某状态下有哪些列要显示 */
    @Method public getColumnsToDisplay(statusName: string): Array<LangItem> {
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

    @Compute(window.readConfig)
    public config: any;

    @Compute(window.defaultConfig)
    public defaultConfig: any;

    @Compute((self: TableMode) => self.iProps.groupData || {})
    public groupData: any;

    @Compute((self: TableMode) => self.iProps.statusNames || [])
    public statusNames: Array<string>;

}

export default $registry.buildComponent('AppTable');