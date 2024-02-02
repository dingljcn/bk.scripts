import './encode-config';
import { AbstractComponent, LangItem } from 'core';
import { Case } from 'dev';
import xfilter from './filter';
import xcard from './card';
import xtable from './table';

window.linkCss('/src/script/case-list/index.css');

window.document.body.innerHTML = `<div id="case-list-dinglj-container">
    <i-nav-view :i-props="navProps">
        <template v-slot:before>
            <xfilter @on-change="obj => filter.data = obj.value"></xfilter>
        </template>
        <template #content="{ active }" id="case-list-view">
            <i-tab-view v-for="componentName in componentNames" :i-props="tabViewProps(componentName, active)">
                <xcard  v-if="filter.data.mode == 'card'" :i-props="cardModeProps(componentName, active)"></xcard>
                <xtable v-else :i-props="tableModeProps(componentName, active)"></xtable>
            </i-tab-view>
        </template>
        <template v-slot:after></template>
    </i-nav-view>
</div>`;

@Service(App, 'App')
export class App extends AbstractComponent<any> {

    @Component({
        xfilter, xcard, xtable
    })
    @Mounted public mounted(): void {
        const _this = this;
        window.displayData = function() {
            console.log(_this);
        }
    }

    @Field public allVersionDatas: any = {};

    @Field public filter: { data: AppFilter } = {
        data: {
            mode: 'card',
            cardCnt: '7',
            versions: '',
            keyword: '',
            status: '',
        }
    };

    /** 某个 Component 分组下, 再次按照 Status 进行细分组 */
    @Method public groupByStatus(componentName: string) {
        return window.groupBy(this.groupByComponent[componentName], (item: Case) => item.status.en);
    }

    /** 某个 Component 分组下, 排好序的 Status 顺序 */
    @Method public statusNames(componentName: string): Array<string> {
        const data = this.groupByStatus(componentName);
        let order: Array<string> = window.getConfigOrDefault('order.preferStatus', [], false)
            .map(i => i.toLowerCase());
        return Object.keys(data).sort((o1: string, o2: string) => {
            return order.compareBy(o1.toLowerCase(), o2.toLowerCase());
        });
    }

    @Method public tabTitle(componentName: string): Array<LangItem> {
        let tabKeys = this.statusNames(componentName);
        return tabKeys.map(key => {
            return new LangItem(key, this.status[key].zh);
        });
    }

    @Compute((self: App): NavigatorViewProps<string> => {
        return {
            list: self.componentNames
        }
    })
    public navProps: NavigatorViewProps<string>;

    @Method public tabViewProps(componentName: string, active: string): TabViewProps<LangItem> {
        return {
            list: this.tabTitle(componentName),
            isActive: componentName == active,
            getLabel: item => item.zh,
        }
    }

    @Method public cardModeProps(componentName: string, active: string): AppCardProps {
        return {
            isActive: componentName == active,
            statusNames: this.statusNames(componentName),
            groupData: this.groupByStatus(componentName),
            cardCnt: this.filter.data.cardCnt,
        }
    }

    @Method public tableModeProps(componentName: string, active: string): AppTableProps {
        return {
            isActive: componentName == active,
            statusNames: this.statusNames(componentName),
            groupData: this.groupByStatus(componentName),
        }
    }

    /** 状态 */
    @Compute((self: App) => window.getConfigOrDefault('constant.status', [], true))
    public status: any

    /** 获取用例集合 */
    @Compute((self: App) => {
        const version = self.filter.data.versions || 'default';
        if (window.isDev()) {
            return window.readData(version); // 用于本地测试, 本地会通过这个方法提供数据
        }
        if (self.allVersionDatas[version]) {
            return self.allVersionDatas[version];
        }
        let result;
        if (version == 'default') {
            const str: string = $net.get(window.getConfigOrDefault('urls.defaultVersionData', '', false));
            result =  JSON.parse(str).testCaseTasks;
        } else {
            const str: string = $net.get(window.getConfigOrDefault('urls.readVersion', '', false) + version);
            result =  JSON.parse(str);
        }
        self.allVersionDatas[version] = result.map((item: any) => new Case(item, self.status));
        return self.allVersionDatas[version];
    })
    public originData: Array<Case>

    /** 经过过滤字段处理的用例集合 */
    @Compute((self: App) => {
        let result = self.originData;
        if (self.filter.data.keyword) {
            result = result.filter((_case_: Case) => _case_.caseName.includesIgnoreCase(self.filter.data.keyword));
        }
        if (self.filter.data.status) {
            result = result.filter((_case_: Case) => JSON.stringify(_case_.status) == JSON.stringify(self.filter.data.status));
        }
        if (result.length == 0) {
            '未找到任何有效数据'.err();
        }
        return result;
    })
    public filteredData: Array<Case>

    /** 将经过过滤处理的用例集合按照 component 字段进行分组, component 值相等的用例放到一个数组中 */
    @Compute((self: App) => {
        let firstGroup = window.groupBy(self.filteredData, 'component');
        const array = self.filteredData.filter((i: Case) => i.level == 0);
        if (array.length > 0) {
            firstGroup['UNIT'] = array;
        }
        return firstGroup;
    })
    public groupByComponent: any;

    
    /** 排过序的模块名称 */
    @Compute((self: App) => {
        let order = window.getConfigOrDefault('order.preferComponent', [], false)
            .map(i => i.toLowerCase());
        order.unshift('unit');
        const result = Object.keys(self.groupByComponent).sort((o1, o2) => {
            return order.compareBy(o1.toLowerCase(), o2.toLowerCase());
        });
        return result;
    })
    componentNames: Array<string>;

}

window.createVue($registry.buildComponent('App'), '#case-list-dinglj-container');