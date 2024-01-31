class LangItem {
    en: string; zh: string;
    constructor(en: string, zh: string) {
        this.en = en;
        this.zh = zh;
    }
}

declare global {
    interface Window {
        LangItem: any;
    }
}

window.LangItem = LangItem;

export default LangItem;