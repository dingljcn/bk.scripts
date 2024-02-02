import { AbstractComponent } from "core";
import { Ticket } from "dev";

@Service(TI_Filter, 'ti-filter')
export class TI_Filter extends AbstractComponent<any> {

    @Template
    public template: string = `<div id="ticket-list-filter">
        <div class="filter-row">
            <i-input class="filter-contrl" :i-props="keywordProp"></i-input>
            <i-combo class="filter-contrl" :i-props="ownerProp"></i-combo>
            <i-combo class="filter-contrl" :i-props="statusProp"></i-combo>
            <i-combo class="filter-contrl" :i-props="reporterProp"></i-combo>
            <i-combo class="filter-contrl" :i-props="componentProp"></i-combo>
        </div>
    </div>`;

    @Field public filter: TikcetListFilter = {} as any;

    @Method public getComboData(column: TicketFields) {
        const result = Array.from(new Set(this.data.map(i => i.get(column))));
        const order = window.getConfigOrDefault(`strategy.order.group.${ column }`, [], false);
        result.sort((s1, s2) => {
            return order.compareBy(s1, s2);
        })
        return result;
    }

    /** 搜索框的相关参数 */
    @Compute((self: TI_Filter): InputProps => {
        return {
            caption: '搜索',
            placeholder: '请输入关键字',
            onEnter(data) {
                self.filter.keyword = data.value;
                self.emit('on-change', self.filter);
            },
            onChange(data) {
                self.filter.keyword = data.value;
                self.emit('on-change', self.filter);
            },
        }
    })
    public keywordProp: InputProps;

    /** 属主下拉框的参数 */
    @Compute((self: TI_Filter): ComboProps<string> => {
        return {
            list: self.getComboData('owner'),
            caption: '属主',
            onChange: function(item): void {
                self.filter.owner = item.value;
                self.emit('on-change', self.filter);
            }
        };
    })
    public ownerProp: ComboProps<string>;

    /** 状态下拉框的参数 */
    @Compute((self: TI_Filter): ComboProps<string> => {
        return {
            list: self.getComboData('status'),
            caption: '状态',
            onChange: function(item): void {
                self.filter.status = item.value;
                self.emit('on-change', self.filter);
            }
        };
    })
    public statusProp: ComboProps<string>;

    /** 报告者下拉框的参数 */
    @Compute((self: TI_Filter): ComboProps<string> => {
        return {
            list: self.getComboData('reporter'),
            caption: '报告者',
            onChange: function(item): void {
                self.filter.reporter = item.value;
                self.emit('on-change', self.filter);
            }
        };
    })
    public reporterProp: ComboProps<string>;

    /** 组件下拉框的参数 */
    @Compute((self: TI_Filter): ComboProps<string> => {
        return {
            list: self.getComboData('component'),
            caption: '组件/模块',
            onChange: function(item): void {
                self.filter.component = item.value;
                self.emit('on-change', self.filter);
            }
        };
    })
    public componentProp: ComboProps<string>;

    @Prop(Array, [], true)
    public data: Array<Ticket>;

}

declare global {
    interface TikcetListFilter {
        keyword: string;
        owner: string;
        status: string;
        reporter: string;
        component: string;
    }
}

export default $registry.buildComponent('ti-filter');