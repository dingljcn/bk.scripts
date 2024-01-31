import { AbstractComponent, ComponentType } from "core";

@Service(SwitchX, ComponentType.SwitchX, true)
export default class SwitchX extends AbstractComponent<SwitchProps> {

    @Template public template: string = `<div class="dinglj-v-switch" @click="onclicked" :style="getStyle()">
        <!-- 开关按钮前的文字 -->
        <div class="dinglj-v-switch-pre">
            {{ preText }}
        </div>
        <!-- 开关按钮 -->
        <div :class="getClass()">
            <div></div>
        </div>
        <!-- 开关按钮后的文字 -->
        <div class="dinglj-v-switch-post">
            {{ postText }}
        </div>
    </div>`;

    @Field public active: boolean = false;

    @Method public getStyle(): object {
        return {
            '--width': this.xSize.equalsIgnoreCase('small') ? '30px' : (this.xSize.equalsIgnoreCase('normal') ? '40px' : '40px'),
            '--height': this.xSize.equalsIgnoreCase('small') ? '24px' : (this.xSize.equalsIgnoreCase('normal') ? '28px' : '32px'),
            '--padding-tb': this.xSize.equalsIgnoreCase('small') ? '5px' : (this.xSize.equalsIgnoreCase('normal') ? '3px' : '8px'),
        };
    }

    @Method public getClass(): object {
        return {
            'dinglj-v-switch-btn': true,
            'active': this.active
        };
    }

    @Method public onclicked(): void {
        this.active = !this.active;
        if (this.active) {
            if (this.postText) {
                `已切换至: ${ this.postText }`.info();
            }
        } else {
            if (this.preText) {
                `已切换至: ${ this.preText }`.info();
            }
        }
        this.iProps.onChange && this.iProps.onChange({
            vid: this.vid,
            value: this.active,
        })
    }

    @Compute((self: SwitchX): SwitchSize => self.iProps.size || 'normal')
    public xSize: SwitchSize;

    @Compute((self: SwitchX) => self.iProps.preTxt || '')
    public preText: string;

    @Compute((self: SwitchX) => self.iProps.postTxt || '')
    public postText: string;

}

declare global {
    /** 控件大小 */
    type SwitchSize = 'small' | 'normal' | 'big';
    /** 开关相关参数 */
    interface SwitchProps {
        /** 大小 */
        size?: SwitchSize;
        /** 开关前面的文字 */
        preTxt?: string;
        /** 开关后的文字 */
        postTxt?: string;
        /** 值变化事件 */
        onChange?(args: EmitArgs<Boolean>): void;
    }
}

$registry.buildAndRegist(ComponentType.SwitchX);