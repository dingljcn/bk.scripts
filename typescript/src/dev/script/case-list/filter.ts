import { AbstractComponent, LangItem } from "core";

@Service(Filter, 'CL-Filter')
class Filter extends AbstractComponent<any> {

    @Template
    public template: string = `<div id="case-filter">
        <div class="filter-row">
            <i-input :i-props="keywordProps"></i-input>
            <i-combo style="margin-left: 10px" :i-props="statusProps"></i-combo>
            <i-combo style="margin-left: 10px; --width: 400px" :i-props="versionProps"></i-combo>
            <div class="dinglj-v-flex"></div>
            <i-switch :i-props="modeProps"></i-switch>
        </div>
        <div class="filter-row" v-if="filter.mode == 'card'">
            <i-input :i-props="cardCntProps"></i-input>
        </div>
    </div>`;

    @Field public filter: AppFilter = {
        keyword: '',
        status: '',
        versions: '',
        mode: 'card',
        cardCnt: '7',
    }

    @Field public versionList: Array<string> = [];

    @Compute((self: Filter): InputProps => {
        return {
            caption: '搜索',
            placeholder: '请输入关键字',
            onChange: (data) => self.filter.keyword = data.value,
        }
    })
    public keywordProps: InputProps;

    @Compute((self: Filter): ComboProps<LangItem> => {
        return {
            caption: '状态',
            list: Object.values(self.status),
            getValue: item => item.en,
            getLabel: item => item.zh,
            onChange: data => self.filter.status = data.value,
        }
    })
    public statusProps: ComboProps<LangItem>;

    @Compute((self: Filter): ComboProps<string> => {
        return {
            caption: '版本',
            placeholder: '默认为当前版本',
            list: self.versionNames,
            onChange: data => self.filter.status = data.value,
        }
    })
    public versionProps: ComboProps<string>;
    
    @Compute((self: Filter): SwitchProps => {
        return {
            preTxt: '卡片视图',
            postTxt: '表格视图',
            onChange: data => self.filter.mode = (data.value ? 'table' : 'card')
        }
    })
    public modeProps: SwitchProps;

    @Compute((self: Filter): InputProps => {
        return {
            caption: '每列的卡片数',
            placeholder: '请输入每列的卡片数量',
            defaultValue: '7',
            onChange: (data) => self.filter.cardCnt = data.value,
        }
    })
    public cardCntProps: InputProps;

    /** 状态 */
    @Compute((self: Filter) => window.getConfigOrDefault('constant.status', [], true))
    public status: any

    @Compute((self: Filter) => {
        if (window.isDev()) {
            return (window as any).readVersion();
        }
        if (self.versionList.length == 0) {
            let versions = window.getConfigOrDefault('urls.versions', '', false);
            self.versionList = JSON.parse($net.get(versions));
        }
        return self.versionList;
    })
    public versions: Array<any>;

    @Compute((self: Filter) => self.versions.map((i: any) => i.erpVersion))
    public versionNames: Array<string>;

    @Watch('filter')
    public onFilterChange(newVal: any, oldVal: any): void {
        this.emit('on-change', newVal);
    }

}

export default $registry.buildComponent('CL-Filter');