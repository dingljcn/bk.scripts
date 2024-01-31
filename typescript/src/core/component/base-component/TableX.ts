import { AbstractComponent, ComponentType, RightMenu } from "core";

@Service(TableX, ComponentType.TableX, true)
export default class TableX<T> extends AbstractComponent<TableProps<T, any>> {

    @Mounted public mounted(): void {
        const self = this;
        window.timer((): boolean => {
            const element: HTMLElement = window.byId(self.vid);
            if (element) {
                self.iProps.loaded && self.iProps.loaded({
                    vid: self.vid,
                    value: element
                });
                return true;
            }
            return false;
        });
        $queue.on('export-to-excel', function(): void {
            self.exportToExcel();
        }, this.vid);
    }

    @Template public template: string = `<div class="dinglj-v-table" :id="vid" :data-title="title">
        <div class="dinglj-v-thead dinglj-v-tr">
            <div :style="getStyle('')" v-if="selectable" class="dinglj-v-table-select" @click="doCheckAll">
                <input type="checkbox" :checked="checkAll"/>选择
            </div>
            <div :style="getStyle('')" v-if="sequenceNum" class="dinglj-v-table-sequence">
                序号
            </div>
            <div :style="getStyle(getColumnKey(column))" :data-key="getColumnKey(column)" v-for="column in columns" :class="getClass(column)" :id="vid + '-Col-' + getColumnKey(column)">
                {{ getColumnLabel(column) }}
                <i-context-menu :i-props="genHeadProps(column)"></i-context-menu>
            </div>
        </div>
        <div class="dinglj-v-tbody" :id="vid + '-Body'">
            <div>
                <div class="dinglj-v-tr" v-for="(line, idx) in list" @click="checkOne(line)" :id="vid + '-' + idx">
                    <div :style="getStyle('')" v-if="selectable" class="dinglj-v-table-select">
                        <input type="checkbox" :checked="checkedList.includesIgnoreCase(line)"/>
                    </div>
                    <div :style="getStyle('')" v-if="sequenceNum" class="dinglj-v-table-sequence">
                        {{ idx + 1 }}
                    </div>
                    <div :style="getStyle(getColumnKey(column))" :class="getClass(column)" v-for="column in columns">
                        <div class="dinglj-v-auto-hidden" v-html="getCell(line, getColumnKey(column))"></div>
                    </div>
                    <i-context-menu :i-props="genLineProps(line, idx)"></i-context-menu>
                </div>
                <i-context-menu :i-props="genBodyProps()"></i-context-menu>
            </div>
        </div>
    </div>`;

    /** 表格计算的缓存 */
    @Field public cache: any = {};

    /** 是否全选所有列 */
    @Field public checkAll: boolean = false;

    /** 已选择的列集合 */
    @Field public checkedList: Array<T> = [];

    /** 最佳列宽缓存 */
    @Field public bestWidthCache: any = false;

    /** 获取右击表格标题列时的右键菜单相关参数 */
    @Method genHeadProps(column: T): ContextMenuProps<TableHeadMenu<T>> {
        return {
            bindId: `${ this.vid }-Col-${ this.getColumnKey(column) }`,
            data: {
                columnKey: this.getColumnKey(column),
                list: this.list,
            },
            list: this.titleColumnMenus
        }
    }

    /** 获取右击表格某一行时的右键菜单相关参数 */
    @Method genLineProps(line: T, idx: number): ContextMenuProps<T> {
        return {
            bindId: `${ this.vid }-${ idx }`,
            data: line,
            list: this.rowMenus
        }
    }

    /** 获取右击表格空白处时的右键菜单相关参数 */
    @Method genBodyProps(): ContextMenuProps<Array<T>> {
        return {
            bindId: `${ this.vid }-Body`,
            data: this.list,
            list: this.bodyMenus
        }
    }

    /** 选中一行或取消选中一行 */
    @Method checkOne(line: T) {
        if (this.checkedList.includes(line)) {
            this.checkedList.remove(line);
            this.checkAll = false;
        } else {
            this.checkedList.push(line);
            if (this.checkedList.length == this.list.length) {
                this.checkAll = true;
            }
        }
    }

    /** 获取表格的 class 信息 */
    @Method getClass(column: any): object {
        const columnKey = this.getColumnKey(column);
        if (this.cache[columnKey]) {
            return this.cache[columnKey];
        }
        let flex = this.flexColumns.includesIgnoreCase(columnKey) ? 'dinglj-v-flex' : 'fixed';
        const result: any = {
            "dinglj-v-cell": true
        };
        result[columnKey] = true;
        result[flex] = true;
        this.cache[columnKey] = result;
        return result;
    }

    /** 获取表格的样式 */
    @Method getStyle(text: string): object {
        let width;
        if (text == '') {
            width = 80;
        } else {
            width = this.getBestWidth()[text];
        }
        return {
            width: `${ width }px`,
        }
    }

    /** 选中所有行或取消选中所有行 */
    @Method doCheckAll(): void {
        this.checkedList.length = 0; // 直接清空
        if (!this.checkAll) { // 当前不是全选, 表示接下来要全选, 全部加入
            this.checkedList.push(...this.list);
        }
        this.checkAll = !this.checkAll;
    }

    /** 获取最佳列宽 */
    @Method getBestWidth(): any {
        if (this.bestWidthCache) {
            return this.bestWidthCache;
        }
        this.bestWidthCache = {};
        // 一列一列分别计算宽度
        for (let column of this.columns) {
            // 计算本列的标题宽度
            const columnKey = this.getColumnKey(column);
            const columnTitle = this.getColumnLabel(column);
            let titleWidth = window.calcTxtWidth(`${ columnTitle }`);
            let widthArray = [ titleWidth ];
            // 计算本列的每一行宽度
            widthArray.push(
                ...this.list.map((e: T) => {
                    const columnContent = this.getCell(e, columnKey);
                    return window.calcTxtWidth(columnContent);
                })
            );
            const maxWidth = Math.max(...widthArray);
            this.bestWidthCache[columnKey] = maxWidth + 30;
        }
        return this.bestWidthCache;
    }

    /** 导出到 excel 的默认方法 */
    @Method exportToExcel(): void {
        const _this: TableX<any> = this;
        window.timer(function() {
            const element = window.byId(_this.vid);
            if (!element) {
                return false;
            }
            let string = '';
            for (let cell of element.children[0].children) {
                if (cell.classList.contains('dinglj-v-table-select')) {
                    continue;
                }
                string += cell.innerText;
            }
            string += '\n';
            for (let line of element.children[1].children[0].children) {
                for (let cell of line.children) {
                    if (cell.classList.contains('dinglj-v-table-select')) {
                        continue;
                    }
                    string += cell.innerText;
                }
                string += '\n';
            }
            console.log(string);
            return true;
        })
    }

    @Compute((self: TableX<T>) => self.iProps.title || '')
    public title: string;

    @Compute((self: TableX<T>) => self.iProps.flexColumns || [])
    public flexColumns: Array<string>;

    @Compute((self: TableX<T>) => self.iProps.list || [])
    public list: Array<T>;

    @Compute((self: TableX<T>) => self.iProps.sequenceNum || true)
    public sequenceNum: boolean;

    @Compute((self: TableX<T>) => self.iProps.selectable || true)
    public selectable: boolean;

    @Compute((self: TableX<T>) => self.iProps.columns || [])
    public columns: Array<any>;

    @Compute((self: TableX<T>) => self.iProps.getColumnKey || ((column: any) => column))
    public getColumnKey: Function;

    @Compute((self: TableX<T>) => self.iProps.getColumnLabel || ((column: any) => column))
    public getColumnLabel: Function;

    @Compute((self: TableX<T>) => self.iProps.getCell || ((item: T, column: any) => {
        let columnKey: string = self.iProps.getColumnKey(column);
        return $get(item, columnKey);
    }))
    public getCell: Function;

    @Compute((self: TableX<T>) => self.iProps.rowMenus || [])
    public rowMenus: Array<RightMenu>;

    @Compute((self: TableX<T>) => self.iProps.bodyMenus || [])
    public bodyMenus: Array<RightMenu>;

    @Compute((self: TableX<T>) => self.iProps.titleColumnMenus || [])
    public titleColumnMenus: Array<RightMenu>;

}

declare global {
    /** 表格相关参数(T: 每个元素/每一行的数据类型, C: 列的数据类型) */
    interface TableProps<T, C> {
        /** 表格数据(每个数组元素就是一行) */
        list: Array<T>;
        /** 需要显示的列 */
        columns: Array<C>;
        /** 表格名称(不显示在界面上, 导出时会用到该名称) */
        title?: string;
        /** 弹性布局的列 */
        flexColumns?: Array<string>;
        /** 是否显示序号 */
        sequenceNum?: boolean;
        /** 是否显示选择列 */
        selectable?: boolean;
        /** 右击某一行时的右键菜单 */
        rowMenus?: Array<RightMenu>;
        /** 右击表格空白处时的右键菜单 */
        bodyMenus?: Array<RightMenu>;
        /** 右击表格标题列时的右键菜单 */
        titleColumnMenus?: Array<RightMenu>;
        /** 获取列的 key */
        getColumnKey?(column: C): string;
        /** 获取要显示的列名 */
        getColumnLabel?(column: C): string;
        /** 获取单元格内容 */
        getCell?(item: T, column: C | string): string;
        /** 表格加载完成事件 */
        loaded?(args: EmitArgs<HTMLElement>): void;
    }
    /** 表格标题列的右键菜单项目 */
    interface TableHeadMenu<T> {
        /** 标题列名 */
        columnKey: string;
        /** 表格数据 */
        list: Array<T>;
    }
}

$registry.buildAndRegist(ComponentType.TableX);