import { LangItem, RightMenu } from "core";
import { Ticket } from "dev";

declare global {
    type TicketFields = keyof typeof Ticket.fields;
    interface TableColumn<T> {
        /** 右键选择的字段 */
        columnKey: TicketFields;
        /** 该表格的所有数据 */
        list: Array<T>
    }
    interface TicketModal {
        /** 要显示的变更 */
        ticket: Ticket;
        /** 是否显示对话框 */
        display: boolean
    }
    interface TicketStorageInfo {
        topTickets: Array<string>;
        myTickets: Array<string>;
    }
    interface TicketSortColumn {
        columnKey: TicketFields;
        type: 'ASC' | 'DESC';
    }
    interface TicketApp {
        sort: TicketSortColumn;
        tops: Array<string>;
        newTickets: Array<string>;
        myTickets: Array<string>;
        originData: Array<Ticket>;
        filterData: Array<Ticket>;
        groupColumn: string;
        groupData: any;
        localStorage: TicketStorageInfo;
        modal: TicketModal;
        tableIdList: Array<string>;
        constant: {
            storage: string,
        }
    }
    interface TicketUtils {
        /** 读取用户配置 */
        config(): any;
        /** 读取系统默认配置 */
        defaultConfig(): any;
        /** 获取我的名称 */
        whoami(): string;
        /** 读取 HTML 中的变更 */
        readTicket(): Array<Ticket>;
        readTicket(htmlData: string): Array<Ticket>;
        /** 获取单元格的内容 */
        getCellValue<T>(vue: TicketApp, ticket: Ticket, col: LangItem | string): T;
        /** 获取变更的描述内容 */
        getSummary(vue: TicketApp, ticket: Ticket): string;
        /** 获取置顶变更, 结果是变更号数组 */
        getTops(vue: TicketApp): Array<string>;
        /** 判断是否为置顶变更 */
        isTop(vue: TicketApp, obj: string | Ticket): boolean;
        /** 获取新增变更, 结果是变更号数组 */
        getNewTickets(vue: TicketApp): Array<string>;
        /** 获取我的变更, 结果是变更号数组 */
        getMyTickets(vue: TicketApp): Array<string>;
        /** 获取本地缓存的置顶变更、我的变更 */
        getLocalStorage(vue: TicketApp): TicketStorageInfo;
        /** 将变更指定的时间相关列(要符合规范)转换为数字 */
        parseTicketTime(ticket: Ticket): number,
        parseTicketTime(ticket: Ticket, field: TicketFields): number;
        parseTime(target: string): string;
        /** 根据时间比较两个变更 */
        sortByTime(ticket1: Ticket, ticket2: Ticket): number;
        /** 将传入的值转换为变更ID(不带'#') */
        toTicketId(target: string | HTMLElement): string;
        /** 打开一个变更 */
        openTicket(vue: TicketApp, target: string | HTMLElement): void;
        /** 更新变更描述字段 */
        updateSummary(vue: TicketApp, ticket: Ticket): void;
        /** 将变更标记为已读 */
        setOpended(vue: TicketApp, target: string): boolean;
        /** 将变更标记为未读 */
        setUnOpen(vue: TicketApp, target: string): boolean;
        /** 将变更标记为置顶 */
        toTop(vue: TicketApp, target: string): void;
        /** 将变更取消置顶 */
        cancelTop(vue: TicketApp, target: string): void;
        /** 根据变更号获取变更 */
        getTicketById(vue: TicketApp, target: string): Ticket;
        /** 表格加载后事件 */
        afterTableLoad(vue: TicketApp, tableId: string): void;
        /** 变更分组 */
        groupData(vue: TicketApp): any;
        /** 分组后的名称集合 */
        groupNames(vue: TicketApp): Array<string>;
        /** 变更分页 */
        tabData(vue: TicketApp, groupName: string): any;
        /** 获取表格行的右键菜单 */
        lineMenu(vue: TicketApp): Array<RightMenu>;
        /** 获取表格体的右键菜单 */
        bodyMenus(vue: TicketApp): Array<RightMenu>;
        /** 获取表格标题列的右键菜单 */
        titleColMenu(vue: TicketApp): Array<RightMenu>;
        /** 要显示的列 */
        columnsToDisplay(vue: TicketApp, groupName: string, tabName: string): Array<LangItem>
    }
}

export {};