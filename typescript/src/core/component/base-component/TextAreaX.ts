import { AbstractComponent, ComponentType } from "core";

@Service(TextAreaX, ComponentType.TextAreaX, true)
export default class TextAreaX extends AbstractComponent<TextAreaProps> {

    @Mounted public mounted(): void {
        this.value = this.iProps.defaultValue || '';
    }

    @Template public template: string = `<!-- 文本域入框 -->
    <div class="dinglj-v-ctl dinglj-v-input text-area" :caption="caption" :style="getStyle()" :id="vid">
        <textarea
            :placeholder="placeholder"
            v-model="value"
            @keyup.enter="setValue(value, 'enter')"
            @input="setValue(value, 'input')"
            @blur="setValue(value, 'blur')"
            @change="setValue(value, 'change')"/>
    </div>`

    @Field public value: string = '';

    @Compute((self: TextAreaX): string => self.iProps.caption)
    caption: string;

    @Compute((self: TextAreaX): string => self.iProps.placeholder)
    placeholder: string;

    @Compute((self: TextAreaX): string => {
        const origin: any = self.iProps.height || 0;
        if (isNaN(origin)) {
            return origin;
        }
        const num = parseInt(origin);
        if (origin < 100) {
            return '100px';
        }
        return `${ num }px`;
    })
    height: string;

    @Method setValue(value: string, eventType: InputEventType) {
        this.value = value;
        const param: EmitArgs<string> = {
            vid: this.vid,
            value: value,
        };
        this.iProps.onChange && this.iProps.onChange(param);
        if (eventType == 'blur') {
            this.iProps.onBlur && this.iProps.onBlur(param);
            this.iProps.onOver && this.iProps.onOver(param);
        }
        if (eventType == 'enter') {
            this.iProps.onEnter && this.iProps.onEnter(param);
            this.iProps.onOver && this.iProps.onOver(param);
        }
    }

    @Method getStyle() {
        return {
            '--text-area-height': this.height,
        };
    }

}

declare global {
    /** 文本框参数 */
    interface TextAreaProps {
        /** 控件名称 */
        caption: string;
        /** 高度 */
        height?: string | number;
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

$registry.buildAndRegist(ComponentType.TextAreaX);
