import { AbstractComponent, ComponentType } from "core";

@Service(TabPanelX, ComponentType.TabPanelX, true)
export default class TabPanelX<T> extends AbstractComponent<TabPanelProps<T>> {

    @Mounted public mounted(): void {
        if (Array.isArray(this.list) && this.list.length > 0) {
            this.clicked(this.list[0], 0);
        }
        /** 下一个 Tab 页事件 */
        $queue.on('tab-panel:next', () => {
            const next = (this.index + 1 + this.list.length) % this.list.length;
            this.clicked(this.list[next], next);
        }, this.vid);
        $queue.on('tab-panel:to', (to: T) => {
            const result = this.list.filter(item => JSON.stringify(item) == JSON.stringify(to));
            if (result.length > 0) {
                this.clicked(result[0], this.list.indexOf(result[0]));
            }
        }, this.vid);
    }

    @Template public template: string = `<div class="dinglj-v-tab-panel" :id="vid" v-if="list.length > 0">
        <div class="dinglj-v-tabpanel-title">
            <div class="dinglj-v-tab-float"></div>
            <div v-for="(item, idx) in list" :class="getClass(item)" :id="getId(idx)" @click="clicked(item, idx)">
                {{ getLabel(item) }}
            </div>
        </div>
        <div class="dinglj-v-tabpanel-view">
            <slot class="tab-panel-content">{{ index }}</slot>
        </div>
    </div>
    <div v-else>
        <h1>未找到数据</h1>
    </div>`;

    @Field public value: T = null;

    @Method public getClass(item: T): object {
        return {
            'dinglj-v-tabpanel-item': true,
            'active': JSON.stringify(this.value) == JSON.stringify(item),
        };
    }

    @Method public getId(index: number): string {
        return `${ this.vid }-${ index }`;
    }

    @Method public clicked(item: T, index: number): void {
        if (item == this.value) {
            return;
        }
        this.value = item;
        this.iProps.onChange && this.iProps.onChange({
            vid: this.vid,
            value: item,
        })
        setTimeout(() => {
            const floatElement = window.query(`#${ this.vid } .dinglj-v-tab-float`)[0];
            const element: HTMLElement = window.byId(this.getId(index));
            if (element) {
                floatElement.style.width = `${ element.offsetWidth }px`;
                floatElement.style.left = `${ element.offsetLeft }px`;
            }
        }, 50);
    }

    @Compute((self: TabPanelX<T>) => {
        if (!self.list.includesIgnoreCase(self.value) && self.list.length > 0) {
            self.clicked(self.list[0], 0);
        }
        return self.list.indexOf(self.value);
    })
    public index: number;

    @Compute((self: TabPanelX<T>) => {
        if (!self.iProps.list) {
            return [];
        }
        let stillExist = false;
        for (let item of self.iProps.list) {
            if (JSON.stringify(self.value) == JSON.stringify(item)) {
                stillExist = true;
                break;
            }
        }
        if (!stillExist) {
            self.clicked(self.iProps.list[0], 0);
        }
        return self.iProps.list;
    })
    public list: Array<T>;

    @Compute((self: TabPanelX<T>) => self.iProps.getLabel || ((item: T) => item))
    public getLabel: Function;

}

declare global {
    /** Tab 页面板相关参数 */
    interface TabPanelProps<T> {
        /** 要显示的 tab 页数组 */
        list: Array<T>;
        /** 获取要显示的 tab 页名称 */
        getLabel?(item: T): string;
        /** Tab 页切换事件 */
        onChange?(args: EmitArgs<T>): void;
    }
}

$registry.buildAndRegist(ComponentType.TabPanelX);