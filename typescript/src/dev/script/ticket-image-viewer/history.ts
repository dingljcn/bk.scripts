import { AbstractComponent } from "core";

@Service(AppHistory, 'AppHistory')
export class AppHistory extends AbstractComponent<any> {
    
    @Mounted public mounted(): void {
        /** 快捷键: 上/下一个 */
        $queue.on('update-history', (prop: ScrollProp) => {
            this.doScroll(prop);
        });
    }

    @Template
    public template: string = `<div id="history-container" class="right-panel" @click="changePanel">
        <div :class="containerClass">
            <div :title="historyNumber" :class="itemClass(idx)" v-for="(historyNumber, idx) of list" @click="setIdx(idx)">
                {{ historyNumber.substring(2).replace(/\.png/, '') }}
            </div>
        </div>
    </div>`;

    @Field public current: number = -1;

    @Field public last: number = -1;

    /** 点击时切换到 history 面板 */
    @Method public changePanel(): void {
        $queue.sendMsg<NavType>('change-active-panel', 'History');
    }
    @Method public setIdx(i: number): void {
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

    @Compute((self: AppHistory) => {
        return {
            history: true,
            arrow: true,
            active: self.arrow == 'History',
        }
    })
    public containerClass: any;

    @Method itemClass(idx: number) {
        return {
            'history-number': true,
            'active': this.current == idx,
            'last': this.last == idx
        }
    }

    @Method doScroll(prop: ScrollProp) {
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
        $queue.sendMsg('tab-view:to', this.tabPanelId, '当前图片')
        $queue.sendMsg('change-img', this.list[next]);
    }

    @Prop(Array<string>, [], true)
    public list: Array<string>;

    @Prop(String, 'Step', true)
    public arrow: NavType;

    @Prop(String, '')
    public tabPanelId: string;

    @Watch('arrow')
    public onArrowChange(newVal: NavType) {
        /** 初始的 history 面板是没有选项的, 当第一次激活 history 面板才有 */
        if (this.arrow == 'History' && this.current == -1 && this.last == -1 && this.list.length > 0) {
            this.setIdx(0);
        }
    }

}

export default $registry.buildComponent('AppHistory');