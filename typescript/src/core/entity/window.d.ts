/** 定义 entity 的 windows 属性 */
declare global {
    interface Window {
        AbstractComponent: any,
        LangItem: any,
        MetaInfo: any,
        Registry: any,
        RightMenu: any,
        ComponentType: any,
        RsaConst: any,
    }
}

export {};