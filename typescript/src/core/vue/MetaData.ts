import AbstractComponent from "./AbstractComponent";
import BasicProperty from "./BasicProperty";

/** 一个组件的基本信息收集 */
export class MetaData<T> extends BasicProperty<T> implements BuildInfo<T> {

    public clazz: any;

    public name: string;

    public mountedName: string;

    public template: string;

    public components: any = {};

    public fieldNames: Array<string> = [];

    public methodNames: Array<string> = [];

    public computes: Array<BuildComputeInfo> = [];

    public watchs: Array<BuildWatchInfo> = [];

    public propMap: Map<string, BuildPropInfo> = new Map();

    private instance: AbstractComponent<T>;

    public getInstance() {
        if (!this.clazz) {
            return null;
        }
        if (this.instance) {
            return this.instance;
        }
        this.instance = new this.clazz();
        return this.instance;
    }

    public getFields() {
        const self = this;
        const instance = this.getInstance();
        return function(): any {
            const result = {
                $class: instance,
                vid: '',
                name: self.name,
            }
            for (let fieldName of self.fieldNames) {
                $set(result, fieldName, $get(instance, fieldName));
            }
            return result;
        }
    }

    public getMethods() {
        const instance = this.getInstance();
        const result: any = {
            getImg: function(path: string): string {
                return mergePath('/src/assets/img/' + path);
            },
            emit: function<T>(event: string, value: T): void {
                this.$emit(event, {
                    vid: this.vid,
                    value: value,
                });
            },
            appMounted: this.mountedName ? $get(instance, this.mountedName) : (() => {}),
        }
        for (let methodName of this.methodNames) {
            result[methodName] = $get(instance, methodName);
        }
        return result;
    }

    public getComputeds() {
        let result: any = {};
        for (let compute of this.computes) {
            result[compute.fieldName] = compute.func;
        }
        return result;
    }

    public setProp(fieldName: string, define: BuildPropInfo) {
        this.propMap.set(fieldName, define);
    }

    public getProps() {
        const result: any = {};
        this.propMap.forEach((value, key) => {
            $set(result, key, value);
        });
        return result;
    }

    public getMounted() {
        return function() {
            const self = this;
            self.vid = window.uuid(self.name);
            self.emit('mounted', self.vid);
            $queue.on('$vue', () => self, self.vid);
            self.appMounted();
        }
    }

    public getTemplate(): string {
        return $get(this.getInstance(), this.template);
    }

    public getWatchs() {
        const instance = this.getInstance();
        let result: any = {};
        for (let watch of this.watchs) {
            result[watch.target] = {
                handler: $get(instance, watch.funcName),
                deep: watch.deep,
            }
        }
        return result;
    }

    public getComponents() {
        return this.components;
    }
    
}

declare global {
    interface BuildWatchInfo {
        /** watch 的对象 */
        target: string;
        /** 是否深度监视 */
        deep: boolean;
        /** 执行的函数名 */
        funcName: string;
    }
    interface BuildComputeInfo {
        /** computed 字段名 */
        fieldName: string;
        /** computed 函数 */
        func: Function;
    }
    interface BuildPropInfo {
        /** 参数类型 */
        type: any;
        /** 参数默认值 */
        default: any;
        /** 是否必填 */
        required: boolean;
    }
    interface BuildInfo<T> {
        /** typescript 的类型 */
        clazz: any;
        /** 类型的名称 */
        name: string;
        /** vue 的字段 */
        fieldNames: Array<string>;
        /** vue 的方法 */
        methodNames: Array<string>;
        /** vue 的计算属性 */
        computes: Array<BuildComputeInfo>;
        /** vue 的上级入参 */
        propMap: Map<string, BuildPropInfo>;
        /** vue 的 dom 结构 */
        template: string;
        /** vue 的 watch 事件 */
        watchs: Array<BuildWatchInfo>;
        /** mounted 的方法名 */
        mountedName: string;
        /** vue 要注册的组件 */
        components: any;
        /** 获取类型的实例 */
        getInstance(): AbstractComponent<T>;
        /** 获取 vue 的字段信息 */
        getFields(): Function;
        /** 获取 vue 的方法 */
        getMethods(): any;
        /** 获取 vue 的计算属性 */
        getComputeds(): any;
        /** 设置 vue 的上级入参 */
        setProp(fieldName: string, define: BuildPropInfo): void;
        /** 获取 vue 的上级入参 */
        getProps(): any;
        /** 获取 vue 的挂载后事件 */
        getMounted(): Function;
        /** 获取 vue 的监视事件 */
        getWatchs(): any;
        /** 获取 vue 的 dom 结构 */
        getTemplate(): string;
        /** 获取 vue 要注册的组件 */
        getComponents(): any;
    }
}

declare global {
    interface Window {
        MetaData: any;
    }
}

window.MetaData = MetaData;

export default MetaData;