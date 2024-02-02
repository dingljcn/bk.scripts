import { AbstractComponent, ComponentType } from "core";

@Service(ModalX, ComponentType.ModalX, true)
export default class ModalX extends AbstractComponent<ModalProps> {

    @Mounted public mounted(): void {
        window.addEventListener('mouseup', this.cleanXY);
    }

    @Template public template: string = `<teleport to="body" v-if="display">
        <!-- 对话框这招背景遮罩 -->
        <div class="dinglj-v-modal-mask"></div>
        <!-- 对话框 -->
        <div class="dinglj-v-modal" :id="vid" @mousemove="moveXY" :style="getStyle()">
            <!-- 标题 -->
            <div class="dinglj-v-modal-title" @mousedown="recordXY">
                <div class="dinglj-v-modal-title-name dinglj-v-auto-hidden">
                    <slot name="title">对话框</slot>
                </div>
                <div class="dinglj-v-flex"></div>
                <div class="dinglj-v-modal-title-btns">
                    <img @click="closeModal()" :src="getImg('delete.png')" class="dinglj-v-close-modal"/>
                </div>
            </div>
            <!-- 内容 -->
            <div class="dinglj-v-modal-content">
                <slot name="content"></slot>
            </div>
            <!-- 按钮 -->
            <div class="dinglj-v-modal-btns">
                <div class="dinglj-v-flex"></div>
                <i-button style="margin-right: 5px;" :i-props="cancelProps">取消</i-button>
                <i-button style="margin-right: 5px;" :i-props="okProps">确认</i-button>
            </div>
        </div>
    </teleport>`;

    @Field public position = {
        x: -1,
        y: -1,
    }

    @Method public getStyle(): any {
        return {
            width: `${ this.width }px`,
            height: `${ this.height }px`,
        }
    }

    @Method public closeModal(): void {
        this.iProps.onClose();
    }

    @Method public recordXY(e: MouseEvent) {
        const modal = window.byId(this.vid);
        if (!modal) {
            this.cleanXY();
            return;
        }
        let modalInfo = getComputedStyle(modal);
        parseInt(getComputedStyle(modal).left)
        this.position = {
            x: e.screenX - parseInt(modalInfo.left),
            y: e.screenY - parseInt(modalInfo.top),
        }
    }

    @Method public moveXY(e: MouseEvent) {
        if (window.getVal(this.position, 'x', -1) >= 0) {
            const modal = window.byId(this.vid);
            modal.style.left = `${ e.screenX - this.position.x }px`;
            modal.style.top = `${ e.screenY - this.position.y }px`;
        }
    }

    @Method public cleanXY() {
        this.position = { x: -1, y: -1 };
    }

    /** 取消按钮的参数 */
    @Compute((self: ModalX) => {
        return {
            type: 'cancel',
            singleClick: function(e: MouseEvent) {
                self.cancel();
            }
        }
    })
    public cancelProps: ButtonProps;

    /** 确认按钮的参数 */
    @Compute((self: ModalX) => {
        return {
            singleClick: function(e: MouseEvent) {
                self.ok();
            }
        }
    })
    public okProps: ButtonProps;

    @Compute((self: ModalX) => self.iProps.display || false)
    public display: boolean;

    @Compute((self: ModalX) => self.iProps.ok || (self.closeModal))
    public ok: Function;

    @Compute((self: ModalX) => self.iProps.cancel || (self.closeModal))
    public cancel: Function;

    @Compute((self: ModalX) => self.iProps.width || 600)
    public width: number;

    @Compute((self: ModalX) => self.iProps.height || 300)
    public height: number;

}

declare global {
    /** 对话框相关参数 */
    interface ModalProps {
        /** 是否显示对话框 */
        display?: boolean;
        /** 对话框宽度 */
        width?: number;
        /** 对话框高度 */
        height?: number;
        /** 窗口关闭事件 */
        onClose(): void;
        /** 点击确定时的事件 */
        ok?(): void;
        /** 点击取消时的事件 */
        cancel?(): void;
    }
}

$registry.buildAndRegist(ComponentType.ModalX);