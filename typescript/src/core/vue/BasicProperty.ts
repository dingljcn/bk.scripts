/** Vue 对象中一些基本的字段, 方法的定义 */
abstract class BasicProperty<T> {
    /** 对象 id */
    vid: string;
    /** 对象名称 */
    name: string;
    /** 上级的入参 */
    iProps: T;
    /** 原生自带的方法, 将图片相对路径转绝对路径 */
    getImg(path: string): string { return '' };
    /** 原生自带的方法, 封装 $emit */
    emit(eventName: string, param: any): void {};
    /** 获取样式 */
    getStyle?(...args: any): any;
    /** 获取class */
    getClass?(...args: any): any;
}

declare global {
    interface Window {
        BasicProperty: any;
    }
}

window.BasicProperty = BasicProperty;

export default BasicProperty;