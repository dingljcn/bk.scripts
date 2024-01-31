declare global {
    interface Window {
        readLines(): Array<string>,
        readSteps(line: string): Array<string>,
        /** 是否按下 alt */
        altDown: boolean,
        /** 截图查看工具类 */
        $tool: ImageUtils;
    }
    /** 滚动参数 */
    interface ScrollProp {
        size?: number,
        current?: number,
        direction?: MoveDirection,
        height?: number,
        qty?: number,
        toStep?: boolean,
        toLastStep?: boolean,
        lineChanged?: boolean,
        limit?: number,
    }
    /** 行变化参数 */
    interface LineChangeProp {
        /** 行号 */
        line: string,
        /** 期望值 */
        expect: number,
        /** 是否要聚焦到步骤面板 */
        toStep: boolean
    }
    /** 截图查看工具类 */
    interface ImageUtils {
        /**
         * 获取活动面板
         */
        getActivePanel(): HTMLElement,
        /**
         * 获取活动面板中一个元素的高度(所有元素高度相等)
         * @param activePanel 当前活动面板
         */
        getOneHeight(activePanel: HTMLElement): number,
        /**
         * 获取需要滚动的元素数量
         * @param current 当前下标
         * @param limit 顶部多少个元素不用滚动
         * @param direction 向上还是向下
         */
        getScrollQty(current: number, limit: number, direction: MoveDirection): number,
        /**
         * 计算活动面板内多少个元素不用进行滚动
         * @param activePanel 活动面板
         */
        getLimit(activePanel: HTMLElement): number,
        /**
         * 计算活动面板内多少个元素不用进行滚动
         * @param activePanel 活动面板
         * @param height 每个元素的高度
         */
        getLimit(activePanel: HTMLElement, height: number): number,
        /**
         * 获取活动面板中当前元素的下标
         * @param activePanel 活动面板
         */
        getCurrentIndex(activePanel: HTMLElement): number,
        /**
         * 获取滚动参数
         * @param activePanel 活动面板
         * @param direction 向上/向下
         */
        getScrollProp(activePanel: HTMLElement, direction: MoveDirection): ScrollProp,
    }
    /** 截图查看工具类 */
    const $tool: ImageUtils;
    /** 移动方向 */
    type MoveDirection = -1 | 0 | 1;
    /** 导航面板类型 */
    type NavType = 'Line' | 'Step' | 'History';
    /** 热键类型 */
    type HotKeyType = 'back' | 'addStar' | 'cleanStar' | 'cleanHistory' | 'downloadCase' | 'defaultStep' | 'erpLog' | 'logs' | 'line' | 'step';
}

export {}