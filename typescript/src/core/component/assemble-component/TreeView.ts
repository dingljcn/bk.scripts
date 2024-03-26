import { AbstractComponent, ComponentType } from "core";

@Service(TreeView, ComponentType.TreeView, true)
export default class TreeView<T, S> extends AbstractComponent<TreeViewProps<T, S>> {

    @Mounted mounted() {
        const self: TreeView<T, S> = this;
        window.addEventListener('mousemove', function(e: MouseEvent) {
            if (self.position.x == -1) {
                return;
            }
            const offset = e.clientX - self.position.x;
            const navigator = window.selector('.dinglj-v-tree-nav')[0];
            navigator.style.width = `${ self.position.width + offset }px`;
        });
        window.addEventListener('mouseup', function(e: MouseEvent) {
            if (self.position.x == -1) {
                return;
            }
            const offset = e.clientX - self.position.x;
            const navigator = window.selector('.dinglj-v-tree-nav')[0];
            navigator.style.width = `${ self.position.width + offset }px`;
            self.position = {
                x: -1,
                width: 0,
            }
        });
    }

    @Template temp = `<!-- 树形视图 -->
    <div class="dinglj-v-tree-view">
        <div class="dinglj-v-tree-nav">
            <i-file-tree :i-props="iProps4Tree()"></i-file-tree>
        </div>
        <div class="dinglj-v-spliter" @mousedown="mousedown"></div>
        <div class="dinglj-v-main-view">
            <i-tab-view :i-props="tabProps()">
                <div v-for="item in selectList">
                    <slot name="content" :item="item.value"></slot>
                </div>
            </i-tab-view>
        </div>
    </div>`;

    @Field selectList: Array<FileTreeItem<T, S>> = [];

    @Field selected: FileTreeItem<T, S>;

    @Field position = {
        x: -1,
        width: 0,
    }

    @Method mousedown(e: MouseEvent) {
        const navigator = window.selector('.dinglj-v-tree-nav')[0];
        this.position = {
            x: e.clientX,
            width: navigator ? navigator.offsetWidth : 0,
        }
    }

    @Method iProps4Tree(): TreeViewProps<T, S> {
        const self: TreeView<T, S> = this;
        return {
            list: self.iProps.list,
            indent: self.iProps.indent,
            parent: self.iProps.parent,
            root: self.iProps.root,
            select: function(args: Array<FileTreeItem<T, S>>) {
                if (args.length > 0) {
                    self.selected = args[args.length - 1];
                    self.selectList.pushNew(self.selected);
                }
                self.iProps.select(args, self.selected);
            }
        }
    }

    @Method tabProps(): TabViewProps<string> {
        return {
            list: this.selectList.filter(item => item).map(item => item.label)
        }
    }
}

declare global {
    type TreeViewProps<T, S> = {
        /** 文件列表 */
        list: Array<FileTreeItem<T, S>>;
        /** 选择事件 */
        select(list: Array<FileTreeItem<T, S>>, item: FileTreeItem<T, S>): void;
        /** 缩进 */
        indent?: number;
        /** 是否为根节点, 用户不要传入该参数 */
        root?: boolean;
        /** 父节点 */
        parent?: FileTreeItem<T, S>;
    };
}

$registry.buildAndRegist(ComponentType.TreeView);