declare global {
    interface Window {
        /** 创建 Vue 程序 */
        createVue(config: any, mountElement: string): any,
        /** 注册 Vue 组件 */
        registVue(name: string, component: Vue): Vue,
        /** 显示 vue 信息 */
        displayData(): any,
    }
}

export {}