import { AbstractComponent, ComponentType } from "core";

@Service(ComboX, ComponentType.ComboX, true)
export default class ComboX<T> extends AbstractComponent<ComboProps<T>> {

    @Template public template: string = `<!-- 下拉框 -->
    <div class="dinglj-v-ctl dinglj-v-input combo" :style="getStyle()" :caption="$caption" :id="vid">
        <input :placeholder="$placeholder" type="text" :value="$list.includesIgnoreCase(value) ? $getValue(value) : ''"/>
        <!-- 下拉框清空按钮 -->
        <img :src="getImg('delete.png')" class="clean" @click="setValue('')"/>
        <!-- 下拉框选项集合 -->
        <div class="dinglj-v-combo-selections">
            <!-- 下拉框选项 -->
            <div class="dinglj-v-combo-selection" v-for="item in $list" @click="setValue(item)">
                {{ $getLabel(item) }}
            </div>
        </div>
    </div>`;

    @Field public value: T = null;

    @Method public setValue(value: T): void {
        if (this.value != value) {
            this.value = value;
            this.$onChange(value);
        }
    }

    @Method public getStyle(): object {
        return {
            '--height': this.$size == 'small' ? '24px' : (this.$size == 'normal' ? '28px' : '32px'),
            '--width': this.$size == 'small' ? '180px' : (this.$size == 'normal' ? '200px' : '220px'),
        };
    }

    /** 值变化事件 */
    @Method public $onChange(data: T): void {
        if (this.iProps.onChange) {
            this.iProps.onChange({
                vid: this.vid,
                value: data,
            });
        }
    };

    /** 要显示的数据, 默认无数据 */
    @Compute((self: ComboX<T>) => self.iProps.list || [])
    public $list: Array<T>;

    /** 组件大小, 默认为 normal */
    @Compute((self: ComboX<T>) => self.iProps.size || 'normal')
    public $size: ComboSize;

    /** 控件名称 */
    @Compute((self: ComboX<T>) => self.iProps.caption || '')
    public $caption: string;

    /** 占位符 */
    @Compute((self: ComboX<T>) => self.iProps.placeholder || `请选择${ self.$caption }`)
    public $placeholder: string;

    /** 获取元素要显示的内容, 默认显示元素本身 */
    @Compute((self: ComboX<T>) => self.iProps.getLabel || ((item: T) => item))
    public $getLabel: Function;

    /** 获取元素的值, 默认值就是元素本身 */
    @Compute((self: ComboX<T>) => self.iProps.getValue || ((item: T) => item))
    public $getValue: Function;

}

declare global {
    /** 下拉框大小 */
    type ComboSize = ButtonSize;
    /** 下拉框参数 */
    interface ComboProps<T> {
        /** 选择列表 */
        list: Array<T>;
        /** 组件名称 */
        caption: string;
        /** 占位文字 */
        placeholder?: string;
        /** 大小 */
        size?: ComboSize;
        /** 值变化事件 */
        onChange?(data: EmitArgs<any>): void;
        /** 获取显示的文字 */
        getLabel?(item: T): string;
        /** 获取实际值 */
        getValue?(item: T): any;
    }
}

$registry.buildAndRegist(ComponentType.ComboX);