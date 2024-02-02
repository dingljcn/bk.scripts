import { AbstractComponent, ComponentType } from "core";

@Service(NavigatorView, ComponentType.NavigatorView, true)
export default class NavigatorView<T> extends AbstractComponent<NavigatorViewProps<T>> {

    @Template public template: string = `<div class="dinglj-v-navigator-view">
        <i-navigator style="margin-right: 10px" :i-props="navigatorProps"></i-navigator>
        <!-- 右侧主要内容显示部分 -->
        <div class="dinglj-v-navigator-right">
            <!-- 主要内容前的插槽 -->
            <slot name="before"></slot>
            <div class="dinglj-v-navigator-content">
                <i-scroller-y :i-props="scrollyProps">
                    <slot name="content" :active="active"></slot>
                </i-scroller-y>
            </div>
            <!-- 主要内容后的插槽 -->
            <slot name="after"></slot>
        </div>
    </div>`;

    @Field public active: T = null;

    @Compute((self: NavigatorView<T>): NavigatorProps<T> => {
        return {
            list: self.list,
            onChange: function(item: EmitArgs<T>) {
                self.active = item.value;
                self.iProps.onChange && self.iProps.onChange({
                    vid: self.vid,
                    value: item.value
                })
            }
        }
    })
    public navigatorProps: NavigatorProps<T>;

    @Compute((self: NavigatorView<T>): ScrollYProps => {
        return {
            size: self.list.length,
            index: self.list.indexOf(self.active)
        }
    })
    public scrollyProps: ScrollYProps;

    @Compute((self: NavigatorView<T>) => self.iProps.list || [])
    public list: Array<T>;

}

declare global {
    type NavigatorViewProps<T> = NavigatorProps<T>;
}

$registry.buildAndRegist(ComponentType.NavigatorView);