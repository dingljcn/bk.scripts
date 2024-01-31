import AbstractComponent from "./AbstractComponent";
import BasicProperty from './BasicProperty';
import ComponentType from "./ComponentType";
import MetaData from "./MetaData";
import './Registry';

declare global {
    /** 默认组件类型 */
    type DefaultComponent = AbstractComponent<any>;
    /** Vue 组件的结构 */
    interface Vue {
        /** 数据 */
        data?(): any;
        /** 挂载后时间 */
        mounted?(): void;
        /** Vue 结构代码 */
        template?: string;
        /** 方法集合 */
        methods?: any;
        /** 计算值集合 */
        computed?: any;
        /** 上级参数 */
        props?: any;
        /** 监听器 */
        watch?: any,
        /** 组件 */
        components? :any;
    }
    /** 子组件向父组件传输数据的结构 */
    interface EmitArgs<T> {
        /** 子组件 id */
        vid: string;
        /** 数据 */
        value: T;
    }
}

export {
    AbstractComponent,
    BasicProperty,
    ComponentType,
    MetaData
};