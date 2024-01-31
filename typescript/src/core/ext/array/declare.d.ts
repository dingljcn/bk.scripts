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
        getIfExist(key: string, expectValue: any): Array<T>;
    }
}

export {}
