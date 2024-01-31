import { AbstractComponent, ComponentType, RightMenu } from "core";

@Service(ContextMenuX, ComponentType.ContextMenuX, true)
export default class ContextMenuX<T> extends AbstractComponent<ContextMenuProps<T>> {

    @Mounted public mounted(): void {
        window.addEventListener('click', this.hidden);
        $queue.on('hidden-right-context-menu', this.hidden);
        this.binding();
    }

    @Template public template: string = `<teleport to="body" v-if="display">
        <div class="dinglj-v-context-menu" :style="position" :id="vid">
            <div v-for="item in $list">
                <div v-if="conditionIfDisplay(item)" class="dinglj-v-context-menu-item" @click.stop="execCommand(item)">
                    <div class="text">{{ item.label }}</div>
                </div>
            </div>
        </div>
    </teleport>`;

    @Field public display: boolean = false;

    @Field public element: HTMLElement;

    @Field public position = {
        top: '0px',
        left: '0px',
        opacity: '0',
    }

    @Method public binding(): void {
        const _this: ContextMenuX<T> = this;
        window.timer((): boolean => {
            if (!_this.iProps.bindId) {
                return false;
            }
            _this.element = window.byId(_this.iProps.bindId);
            if (!_this.element) {
                return false;
            }
            _this.element.addEventListener('contextmenu', function(e: MouseEvent): void {
                $queue.sendMsg('hidden-right-context-menu', null);
                e.stopPropagation();
                e.preventDefault();
                _this.position.left = e.clientX + 'px';
                _this.position.top = e.clientY + 'px';
                _this.position.opacity = '1';
                _this.display = true;
                window.timer(function(): boolean {
                    let contextMenu = window.byId(_this.vid);
                    if (contextMenu) {
                        if (window.innerHeight - contextMenu.offsetTop < contextMenu.offsetHeight) {
                            contextMenu.style.transform = 'translate(0, -100%)';
                        } else {
                            contextMenu.style.removeProperty('transform');
                        }
                        return true;
                    }
                    return false;
                });
            });
            return true;
        }, 500);
    }

    @Method public hidden(): void {
        this.position.opacity = '0';
        this.display = false;
    }

    @Method public conditionIfDisplay(item: RightMenu): boolean {
        return item.isDisplay(this.$ctx, this.element);
    }

    @Method public execCommand(item: RightMenu): void {
        item.event(this.$ctx, this.element);
        this.hidden();
    }

    /** 要显示的右键菜单数组 */
    @Compute((self: ContextMenuX<T>) => self.iProps.list || [])
    public $list: Array<RightMenu>;

    /** 右键菜单相关的数据 */
    @Compute((self: ContextMenuX<T>) => self.iProps.data || ({} as any))
    public $ctx: T;

}

declare global {
    interface ContextMenuProps<T> {
        /** 添加右键事件的元素 id */
        bindId: string;
        /** 菜单数组 */
        list: Array<RightMenu>;
        /** bindId 对应元素中相关的数据 */
        data?: T;
    }
}

$registry.buildAndRegist(ComponentType.ContextMenuX);