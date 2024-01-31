import { AbstractComponent, ComponentType } from "core";

@Service(ScrollerX, ComponentType.ScrollerX, true)
export default class ScrollerX extends AbstractComponent<ScrollXProps> {

    @Template public template: string = `<div class="dinglj-v-row-scroll" :id="vid" :style="getStyle()">
        <slot></slot>
    </div>`;

    /** 总个数 */
    @Compute((self: ScrollerX) => self.iProps.size || 0)
    public size: number;

    /** 当前下标 */
    @Compute((self: ScrollerX) => self.iProps.index || 0)
    public index: number;
    
    @Method public getStyle(): object {
        return {
            'left': `-${ (this.index >= 0 && this.index < this.size) ? this.index : 0 }00%`,
            'width': `${ this.size }00%`
        };
    }
    
}

declare global {
    /** 横向滚动面板相关参数 */
    interface ScrollXProps {
        /** 当前下标 */
        index: number;
        /** 总个数 */
        size: number
    }
}

$registry.buildAndRegist(ComponentType.ScrollerX);