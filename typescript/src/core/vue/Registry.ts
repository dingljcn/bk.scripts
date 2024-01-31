import ComponentType from "./ComponentType";
import MetaData from "./MetaData";

declare global {
    /** 注册器 */
    const $registry: Registry;
    /** 注册器 */
    interface Registry {
        /** 获取一个组件 */
        getComponent<T>(): MetaData<T>;
        /** 根据名称获取一个组件 */
        getComponent<T>(type: string): MetaData<T>;
        /** 构建一个组件 */
        buildComponent<T>(type: string): Vue;
        /** 构建一个组件 */
        buildAndRegist<T>(type: string): Vue;
    }
    interface Window {
        $registry: Registry;
    }
}

/** 临时对象 */
let tmp: MetaData<any> = null;

/** Map<组件类型, 组件对象> */
const map: Map<ComponentType, MetaData<any>> = new Map(); 

window.$registry = {} as any;

$registry.getComponent = function(type?: ComponentType) {
    if (type && tmp) {
        map.set(type, tmp);
        tmp = null;
        return map.get(type);
    }
    if (tmp) {
        return tmp;
    }
    tmp = new MetaData<any>();
    return tmp;
}

$registry.buildComponent = function(type: ComponentType): Vue {
    const instance = map.get(type);
    return {
        data: instance.getFields(),
        mounted: instance.getMounted(),
        template: instance.getTemplate(),
        methods: instance.getMethods(),
        computed: instance.getComputeds(),
        props: instance.getProps(),
        watch: instance.getWatchs(),
        components: instance.getComponents(),
    }
}

$registry.buildAndRegist = function(type: ComponentType): Vue {
    const instance = map.get(type);
    const component = $registry.buildComponent(type);
    return window.registVue(instance.name, component);
}

export {};