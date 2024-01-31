import { AbstractComponent, ComponentType } from "core";

@Service(ScrollerY, ComponentType.ScrollerY, true)
export default class ScrollerY extends AbstractComponent<ScrollYProps> {

    @Template public template: string = `<div class="dinglj-v-column-scroll" :id="vid" :style="getStyle()">
        <slot></slot>
    </div>`;

    /** 总个数 */
    @Compute((self: ScrollerY) => self.iProps.size || 0)
    public size: number;

    /** 当前下标 */
    @Compute((self: ScrollerY) => self.iProps.index || 0)
    public index: number;
    
    @Method getStyle(): object {
        return {
            'top': `-${ (this.index >= 0 && this.index < this.size) ? this.index : 0 }00%`,
            'height': `${ this.size }00%`
        };
    }
    
}

declare global {
    /** 纵向滚动面板相关参数 */
    type ScrollYProps = ScrollXProps
}

$registry.buildAndRegist(ComponentType.ScrollerY);