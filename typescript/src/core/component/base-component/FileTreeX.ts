import { AbstractComponent, ComponentType } from "core";

@Service(FileTreeX, ComponentType.FileTreeX, true)
export default class FileTreeX<T, S> extends AbstractComponent<FileTreeProps<T, S>> {

    @Template public template: string = `<!-- 树形导航菜单 -->
    <div :style="{ 'margin-left': root ? '0px' : indent + 'px' }" v-for="item in list" :data-title="item.label">
        <div class="dinglj-v-tree-label" @click.stop="expand($event, item)">
            <img class="dinglj-v-menu-icon" v-if="item.type == 'entry'" :src="getImg('folder.png')"/>
            <img class="dinglj-v-menu-icon" v-else :src="getImg('excel.png')"/>
            <span>{{ item.label }}</span>
        </div>
        <div class="dinglj-v-tree-children">
            <div>
                <i-file-tree :i-props="iProps4Children(item)"></i-file-tree>
            </div>
        </div>
    </div>`;

    @Compute((self: FileTreeX<T, S>) => self.iProps.root == undefined)
    root: boolean;

    @Compute((self: FileTreeX<T, S>) => self.iProps.list || [])
    list: T;

    @Compute((self: FileTreeX<T, S>) => self.iProps.indent || 20)
    indent: number;

    @Method public iProps4Children(item: FileTreeItem<T, S>): FileTreeProps<T, S> {
        const self: FileTreeX<T, S> = this;
        return {
            root: false,
            indent: this.indent,
            list: item.children,
            parent: item,
            select: function(args: Array<FileTreeItem<T, S>>) {
                console.log(args);
                if (self.iProps.parent) {
                    args.unshift(self.iProps.parent);
                }
                self.iProps.select(args);
            }
        };
    }

    @Method expand(event: Event, item: FileTreeItem<T, S>) {
        if (item.type == 'entry') {
            let clickElement: HTMLElement = event.target as any;
            if (clickElement.classList.contains('dinglj-v-tree-label')) {
                clickElement = clickElement.nextElementSibling as HTMLElement;
            } else if (clickElement.tagName == 'SPAN' && clickElement.parentElement.classList.contains('dinglj-v-tree-label')) {
                clickElement = clickElement.parentElement.nextElementSibling as HTMLElement;
            }
            if (clickElement.classList.contains('expand')) {
                clickElement.classList.remove('expand');
            } else {
                clickElement.classList.add('expand');
            }
        } else {
            const resultStack = [ item ];
            if (this.iProps.parent) {
                resultStack.unshift(this.iProps.parent);
            }
            this.iProps.select(resultStack);
        }
    }

}

declare global {
    /** 菜单类型 */
    type FileTreeType = 'entry' | 'item';
    interface FileTreeItem<T, S> {
        /** uuid */
        uuid: string;
        /** 显示的菜单名称 */
        label: string;
        /** 菜单类型 */
        type: FileTreeType;
        /** 子元素 */
        children?: Array<FileTreeItem<T, S>>;
        /** 菜单对应的一些附加值 */
        value?: S;
    }
    /** 文件树相关参数 */
    interface FileTreeProps<T, S> {
        /** 文件列表 */
        list: Array<FileTreeItem<T, S>>;
        /** 选择事件 */
        select(list: Array<FileTreeItem<T, S>>): void;
        /** 缩进 */
        indent?: number;
        /** 是否为根节点, 用户不要传入该参数 */
        root?: boolean;
        /** 父节点 */
        parent?: FileTreeItem<T, S>;
    }

}

$registry.buildAndRegist(ComponentType.FileTreeX);