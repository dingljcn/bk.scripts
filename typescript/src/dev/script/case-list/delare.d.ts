declare global {
    /** 卡片组件的参数 */
    interface AppCardProps {
        /** 当前分组的数据 */
        groupData: any;
        /** 用例状态的名字 */
        statusNames: Array<string>;
        /** 每列多少个卡片 */
        cardCnt: string;
        /** 是否是当前界面 */
        isActive?: boolean;
    }
    /** 表格组件的参数 */
    interface AppTableProps {
        /** 当前分组的数据 */
        groupData: any;
        /** 是否是当前界面 */
        isActive?: boolean;
        /** 用例状态的名字 */
        statusNames: Array<string>;
    }
    /** 显示模式 */
    type DisplayType = 'table' | 'card';
    /** 过滤器结构 */
    interface AppFilter {
        /** 关键字 */
        keyword: string;
        /** 状态 */
        status: string;
        /** 版本 */
        versions: string;
        /** 显示模式 */
        mode: DisplayType;
        /** 每列卡片个数 */
        cardCnt: string;
    }
}

export {}