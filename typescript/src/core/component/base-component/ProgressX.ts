import { AbstractComponent, ComponentType } from "core";

@Service(ProgressX, ComponentType.ProgressX, true)
export default class ProgressX extends AbstractComponent<ProgressProps> {

    @Template public template: string = `<!-- 进度条 -->
    <div class="dinglj-v-progress-bar" :id="vid">
        <!-- 上方文本 -->
        <span :class="{ 'dinglj-v-progress-caption': true, 'top': true, 'right': position == 'TopRight' }" v-if="['TopLeft', 'TopRight'].includesIgnoreCase(position)">{{ caption }}{{ percent }}</span>
        <!-- 进度条本体 -->
        <div class="dinglj-v-progress-box" :style="getContainerStyle()">
            <div class="dinglj-v-progress" :style="getProgressStyle()"></div>
        </div>
        <!-- 下方文本 -->
        <span :class="{ 'dinglj-v-progress-caption': true, 'bottom': true, 'right': position == 'BottomRight' }" v-if="['BottomLeft', 'BottomRight'].includesIgnoreCase(position)">{{ caption }}{{ percent }}</span>
    </div>`;
    
    @Method public getContainerStyle(): object {
        return {
            '--bar-height': this.height,
        }
    }

    @Method public getProgressStyle(): object {
        window.timer((self: ProgressX) => {
            const container = window.byId(self.vid);
            if (!container) {
                return false;
            }
            const box = container.findChildrenByClass('dinglj-v-progress-box')[0];
            box.children[0].style.width = self.percent;
            return true;
        }, this);
        return {
            'width': '0%',
        }
    }

    /** 高度, 单位: px */
    @Compute((self: ProgressX) => (self.iProps.height || 5) + 'px')
    public height: string;

    /** 进度条的进度百分比 */
    @Compute((self: ProgressX) => self.iProps.percent || '100%')
    public percent: string;

    /** 位置 */
    @Compute((self: ProgressX): ProgressTxtPosition => self.iProps.txtPosition || 'TopLeft')
    public position: ProgressTxtPosition;

    /** 控件名称 */
    @Compute((self: ProgressX) => self.iProps.caption || '')
    public caption: string;

}

declare global {
    /** 进度条文本显示位置 */
    type ProgressTxtPosition = 'TopLeft' | 'TopRight' | 'BottomLeft' | 'BottomRight';
    /** 进度条相关参数 */
    interface ProgressProps {
        /** 进度条的进度百分比 */
        percent: string;
        /** 控件名称 */
        caption: string;
        /** 高度, 单位: px */
        height?: number;
        /** 位置 */
        txtPosition?: ProgressTxtPosition;
    }
}

$registry.buildAndRegist(ComponentType.ProgressX);