import { AbstractComponent, ComponentType } from "core";

@Service(TabView, ComponentType.TabView, true)
export default class TabView<T> extends AbstractComponent<TabViewProps<T>> {

    @Mounted public mounted(): void {
        $queue.on('tab-view:next', () => {
            $queue.sendMsg('tab-panel:next', null, this.tabPanelId);
        }, this.vid);
        /** 指定 Tab 页事件 */
        $queue.on('tab-view:to', (to: any) => {
            $queue.sendMsg('tab-panel:to', to, this.tabPanelId);
        }, this.vid);
    }

    @Template public template: string = `<!-- Tab 页视图 -->
    <div class="dinglj-v-tab-panel-view" :id="vid">
        <i-tab-panel :i-props="tabPanelProps" @mounted="tabPanelLoaded">
            <i-scroller-x :i-props="scrollxProps">
                <slot></slot>
            </i-scroller-x>
        </i-tab-panel>
    </div>`;

    @Compute((self: TabView<T>): ScrollXProps => {
        return {
            size: self.list.length,
            index: self.index,
        }
    })
    public scrollxProps: ScrollXProps;

    @Compute((self: TabView<T>): TabPanelProps<T> => {
        return {
            list: self.list,
            getLabel: self.iProps.getLabel,
            onChange: function(args: EmitArgs<T>): void {
                if (self.value != args.value) {
                    self.value = args.value;
                    self.iProps.onChange && self.iProps.onChange({
                        vid: self.vid,
                        value: args.value,
                    })
                }
            }
        }
    })
    public tabPanelProps: TabPanelProps<T>;

    @Field public value: T = null;

    @Field public tabPanelId: string = '';

    @Method public tabPanelLoaded(param: EmitArgs<any>): void {
        this.tabPanelId = param.value;
    }

    @Compute((self: TabView<T>) => self.list.indexOfIgnoreCase(self.value))
    public index: number;

    @Compute((self: TabView<T>) => self.iProps.list || [])
    public list: Array<T>;
    
}

declare global {
    /** Tab 页视图相关参数 */
    type TabViewProps<T> = TabPanelProps<T>
}

$registry.buildAndRegist(ComponentType.TabView);