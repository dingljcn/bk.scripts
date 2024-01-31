import { AbstractComponent, ComponentType } from "core";

@Service(ButtonX, ComponentType.ButtonX, true)
export default class ButtonX extends AbstractComponent<ButtonProps> {

    @Template template: string = `<div :class="getClass()" :id="vid" :style="getStyle()" @click="$singleClick">
        <slot></slot>
    </div>`;

    @Method public getClass(): object {
        return {
            'dinglj-v-btn': true, 
            'dinglj-v-ctl': true,
            'primary': this.$type == 'primary',
            'cancel': this.$type == 'cancel',
            'warn': this.$type == 'warn',
            'error': this.$type == 'error',
        };
    }

    @Method public getStyle(): object {
        return {
            '--height': this.$size.equalsIgnoreCase('small') ? '24px' : (this.$size.equalsIgnoreCase('normal') ? '28px' : '32px'),
            '--margin-tb': this.$size.equalsIgnoreCase('small') ? '1px' : (this.$size.equalsIgnoreCase('normal') ? '2px' : '3px'),
        };
    }

    @Compute((self: ButtonX) => self.iProps.singleClick || ((e: MouseEvent) => {}))
    public $singleClick: Function;

    @Compute((self: ButtonX) => self.iProps.size || 'normal')
    public $size: ButtonSize;

    @Compute((self: ButtonX) => self.iProps.type || 'primary')
    public $type: ButtonType;

}

declare global {
    /** 按钮大小 */
    type ButtonSize = 'small' | 'normal' | 'big';
    /** 按钮类型 */
    type ButtonType = 'primary' | 'warn' | 'error' | 'cancel';
    /** 按钮参数 */
    interface ButtonProps {
        /** 大小 */
        size?: ButtonSize;
        /** 类型 */
        type?: ButtonType;
        /** 点击事件 */
        singleClick?(event: MouseEvent): void;
    }
}

$registry.buildAndRegist(ComponentType.ButtonX);