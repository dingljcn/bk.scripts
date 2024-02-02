import { AbstractComponent, ComponentType } from "core";

@Service(NavigatorX, ComponentType.NavigatorX, true)
export default class NavigatorX<T> extends AbstractComponent<NavigatorProps<T>> {

    @Mounted public mounted() {
        if (this.default != null) {
            this.setValue(this.default);
        } else if (this.list.length > 0) {
            this.setValue(this.list[0]);
        }
    }

    @Template public template: string = `<!-- 导航菜单 -->
    <div id="dinglj-v-navigator">
        <!-- 每一个菜单 -->
        <div class="dinglj-v-navigator-item" v-for="item in list" @click="setValue(item)" :class="{ 'active': validItem == item }">
            {{ getCaption(item) }}
        </div>
    </div>`;

    @Field public value: T = null;

    @Method public setValue(value: T): void {
        if (this.value != value) {
            this.value = value;
            this.iProps.onChange && this.iProps.onChange({
                vid: this.vid,
                value: value
            })
        }
    }

    @Compute((self: NavigatorX<T>) => {
        if (self.value != null) {
            if (!self.list.includesIgnoreCase(self.value) && self.list.length > 0) {
                self.setValue(self.list[0]);
            }
        } else if (self.list.length > 0) {
            self.setValue(self.list[0]);
        }
        return self.value;
    })
    public validItem: T;

    /** 要显示的数据 */
    @Compute((self: NavigatorX<T>) => self.iProps.list || [])
    public list: Array<T>;

    /** 默认要显示的目录 */
    @Compute((self: NavigatorX<T>) => self.iProps.default || (self.list.length > 0 ? self.list[0] : null))
    public default: T;

    /** 获取元素要显示的内容, 默认显示元素本身 */
    @Compute((self: NavigatorX<T>) => self.iProps.getCaption || ((item: T) => item))
    public getCaption: Function;

}

declare global {
    /** 导航窗格相关参数 */
    interface NavigatorProps<T> {
        /** 导航目录数组 */
        list: Array<T>;
        /** 默认目录 */
        default?: T;
        /** 获取要显示的目录文本 */
        getCaption?(item: T): string;
        /** 目录切换事件 */
        onChange?(arg: EmitArgs<T>): void;
    }
}

$registry.buildAndRegist(ComponentType.NavigatorX);