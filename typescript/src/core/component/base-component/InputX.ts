import { AbstractComponent, ComponentType } from "core";

@Service(InputX, ComponentType.InputX, true)
export default class InputX extends AbstractComponent<InputProps> {

    @Mounted public mounted(): void {
        $queue.on('dinglj-v-input-text::clear', () => {
            this.value = '';
        }, this.vid);
        $queue.on('dinglj-v-input-text::focus', () => {
            window.byId(this.vid).children[0].focus();
        }, this.vid);
        this.value = this.iProps.defaultValue || '';
    }

    @Template public template: string = `<!-- 文本输入框 -->
    <div class="dinglj-v-ctl dinglj-v-input text" :caption="$caption" :style="getStyle()" :id="vid">
        <input type="text" :placeholder="$placeholder" v-model="value" @keyup.enter="setValue(value, 'enter')" @input="setValue(value, 'input')" @blur="setValue(value, 'blur')" @change="setValue(value, 'change')"/>
        <!-- 文本输入框清空按钮 -->
        <img :src="getImg('delete.png')" class="clean" @click="setValue('', 'change')"/>
    </div>`

    @Field public value: string = '';

    @Method public getStyle(): object {
        const result = {
            '--height': this.$size == 'small' ? '24px' : (this.$size == 'normal' ? '28px' : '32px'),
            '--width': this.$size == 'small' ? '180px' : (this.$size == 'normal' ? '200px' : '220px'),
        };
        return result;
    }

    @Method public setValue(value: string, eventName: InputEventType): void {
        this.value = value;
        const param: EmitArgs<string> = {
            vid: this.vid,
            value: value,
        };
        this.iProps.onChange && this.iProps.onChange(param);
        if (eventName == 'blur') {
            this.iProps.onBlur && this.iProps.onBlur(param);
            this.iProps.onOver && this.iProps.onOver(param);
        }
        if (eventName == 'enter') {
            this.iProps.onEnter && this.iProps.onEnter(param);
            this.iProps.onOver && this.iProps.onOver(param);
        }
    }

    /** 组件大小, 默认为 normal */
    @Compute((self: InputX): InputSize => self.iProps.size || 'normal')
    public $size: ComboSize;

    /** 控件名称 */
    @Compute((self: InputX) => self.iProps.caption || '')
    public $caption: string;

    /** 占位符 */
    @Compute((self: InputX) => self.iProps.placeholder || `请输入${ self.$caption }`)
    public $placeholder: string;

}

declare global {
    /** 文本框事件 */
    type InputEventType = 'input' | 'change' | 'blur' | 'enter';
    /** 文本框大小 */
    type InputSize = 'small' | 'normal' | 'big';
    /** 文本框参数 */
    interface InputProps {
        /** 控件名称 */
        caption: string;
        /** 大小 */
        size?: InputSize;
        /** 默认值 */
        defaultValue?: string;
        /** 占位文本 */
        placeholder?: string;
        /** 输入完成事件 */
        onOver?(data: EmitArgs<string>): void;
        /** 输入事件 */
        onChange?(data: EmitArgs<string>): void;
        /** 回车事件 */
        onEnter?(data: EmitArgs<string>): void;
        /** 失去焦点事件 */
        onBlur?(data: EmitArgs<string>): void;
    }
}

$registry.buildAndRegist(ComponentType.InputX);
