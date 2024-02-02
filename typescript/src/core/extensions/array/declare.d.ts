declare global {
    interface Array<T> {
        /** 忽略大小写判断是否有子串 */
        includesIgnoreCase(another: T): boolean;
        /** 忽略大小写获取下标 */
        indexOfIgnoreCase(another: T): number;
        /** 不存在时添加 */
        pushNew(element: T): boolean;
        /** 删除元素 */
        remove(element: T): boolean;
        /** 根据属性查找元素, 如果存在则返回 */
        getIfExistByKey(key: string, expectValue: any): Array<T>;
        /** 给定一个参照数组, 然后按照此数组进行排序 */
        compareBy(item1: string, item2: string): number,
    }
}

export {}
