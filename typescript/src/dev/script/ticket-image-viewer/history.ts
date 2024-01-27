import { AbstractComponent, Compute, Field, Method, Mounted, Prop, Registry, Template, Watch } from "core";
import NavType from "./NavType";
import { $tool } from "./tool";

export class TIV_History extends AbstractComponent {
    
    @Mounted(TIV_History, 'iv-history')
    public mounted(): void {
        this.vid = window.uuid(this.name);
        this.emit('mounted', this.vid);
        /** 快捷键: 上/下一个 */
        window.$queue.on('update-history', (prop: ScrollProp) => {
            this.doScroll(prop);
        });
    }

    @Template
    public template: string = `<div id="history-container" class="right-panel" @click="changePanel">
        <div :class="{ 'history': true, 'arrow': true, 'active': arrow == 'history' }">
            <div :title="historyNumber" :class="{ 'history-number': true, 'active': current == idx, 'last': last == idx }" v-for="(historyNumber, idx) of list" @click="setIdx(idx)">
                {{ historyNumber.substring(2).replace(/\.png/, '') }}
            </div>
        </div>
    </div>`;

    @Field
    public current: number = -1;

    @Field
    public last: number = -1;

    /** 点击时切换到 history 面板 */
    @Method
    public changePanel(): void {
        window.$queue.sendMsg('change-active-panel', 'history');
    }
    @Method
    public setIdx(i: number): void {
        const historyContainer = window.byClass('history arrow')[0];
        if (historyContainer) {
            const limit = $tool.getLimit(historyContainer);
            this.doScroll({
                size: this.list.length,
                current: i,
                direction: 0,
                height: $tool.getOneHeight(historyContainer),
                qty: $tool.getScrollQty(i, limit, 0),
            });
        }
    }

    @Method
    doScroll(prop: ScrollProp) {
        const next = prop.current + prop.direction;
        if (next < 0) {
            '已经是第一张'.info();
            return;
        } else if (next >= prop.size) {
            '已经是最后一张'.info();
            return;
        } else if (this.current == next) {
            return;
        }
        window.byId('history-container').scrollTo(0, prop.height * prop.qty);
        this.last = this.current;
        this.current = next;
        window.$queue.sendMsg('tab-view:to', this.tabPanelId, '当前图片')
        window.$queue.sendMsg('change-img', this.list[next]);
    }

    @Prop(Array<string>, [], true)
    public list: Array<string>;

    @Prop(String, NavType.Step, true)
    public arrow: NavType;

    @Prop(String, '')
    public tabPanelId: string;

    @Watch('arrow')
    public onArrowChange(newVal: NavType) {
        /** 初始的 history 面板是没有选项的, 当第一次激活 history 面板才有 */
        if ('history' == this.arrow && this.current == -1 && this.last == -1 && this.list.length > 0) {
            this.setIdx(0);
        }
    }

}

export const ivhistory = Registry.getComponent('iv-history').build();